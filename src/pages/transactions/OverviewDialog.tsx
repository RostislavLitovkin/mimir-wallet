// Copyright 2023-2023 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Transaction } from '@mimirdev/hooks/types';

import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';

import { TxOverview } from '@mimirdev/components';
import { useToggle } from '@mimirdev/hooks';

interface Props {
  tx: Transaction;
}

function OverviewDialog({ tx }: Props) {
  const [open, toggle] = useToggle();

  return (
    <>
      <Dialog fullWidth maxWidth='lg' onClose={toggle} open={open}>
        <DialogTitle>Progress Overview</DialogTitle>
        <DialogContent
          sx={{
            height: '50vh',
            bgcolor: 'secondary.main',
            borderRadius: 1
          }}
        >
          {open && <TxOverview tx={tx} />}
        </DialogContent>
      </Dialog>
      <Button onClick={toggle} size='small' sx={{ alignSelf: 'start' }} variant='outlined'>
        Overview
      </Button>
    </>
  );
}

export default React.memo(OverviewDialog);
