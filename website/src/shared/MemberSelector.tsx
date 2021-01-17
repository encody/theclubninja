import React, { useState } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/esm/Button';
import FormControl from 'react-bootstrap/FormControl';
import { IMember } from '../model/Member';
import { useServer } from '../server';
import * as Icon from 'react-feather';

interface MemberSelectorProps {
  id: string;
  member: IMember | null;
  filter: (member: IMember) => boolean;
  onSelect: (member: IMember | null) => void;
}

export default function MemberSelector(props: MemberSelectorProps) {
  const server = useServer();
  const [filterString, setFilterString] = useState('');
  const [selectedMember, setSelectedMember] = useState(null as IMember | null);

  return (
    <>
      <DropdownButton
        as={ButtonGroup}
        id={props.id}
        title={
          props.member
            ? `${props.member.name} (${props.member.accountId})`
            : 'Select member...'
        }
      >
        <div className="d-flex">
          <FormControl
            autoFocus
            className="mx-3 my-2 flex-grow-1"
            placeholder="Type to filter..."
            onChange={e => setFilterString(e.target.value)}
            value={filterString}
          />
        </div>
        <Dropdown.Divider />
        <ul
          className="list-unstyled"
          style={{
            maxHeight: '50vh',
            overflowY: 'auto',
          }}
        >
          {server.model &&
            Object.values(server.model.members)
              .filter(props.filter)
              .filter(
                m =>
                  m.accountId
                    .toLowerCase()
                    .includes(filterString.toLowerCase()) ||
                  m.name.toLowerCase().includes(filterString.toLowerCase()),
              )
              .map(m => (
                <Dropdown.Item
                  key={m.accountId}
                  active={m === selectedMember}
                  onClick={() => {
                    setSelectedMember(m);
                    props.onSelect(m);
                  }}
                >
                  {m.name} ({m.accountId})
                </Dropdown.Item>
              ))}
        </ul>
      </DropdownButton>{' '}
      {selectedMember !== null && (
        <Button
          variant="light"
          onClick={() => {
            setSelectedMember(null);
            props.onSelect(null);
          }}
        >
          <Icon.XCircle />
        </Button>
      )}
    </>
  );
}
