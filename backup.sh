#!/bin/sh

now=$(date +%F-%H-%M-%S)
mkdir -p backups/$now
cd backups/$now

fuego query --limit 99999 chargeTypes > chargeTypes.json
fuego query --limit 99999 charges > charges.json
fuego query --limit 99999 creditTypes > creditTypes.json
fuego query --limit 99999 invoices > invoices.json
fuego query --limit 99999 memberTypes > memberTypes.json
fuego query --limit 99999 members > members.json
fuego query --limit 99999 memberships > memberships.json
fuego query --limit 99999 terms > terms.json
fuego query --limit 99999 users > users.json
