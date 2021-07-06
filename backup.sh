#!/bin/sh

now=$(date +%F-%H-%M-%S)
mkdir -p backups/$now
cd backups/$now

fuego query chargeTypes > chargeTypes.json
fuego query charges > charges.json
fuego query creditTypes > creditTypes.json
fuego query invoices > invoices.json
fuego query memberTypes > memberTypes.json
fuego query members > members.json
fuego query memberships > memberships.json
fuego query terms > terms.json
fuego query users > users.json
