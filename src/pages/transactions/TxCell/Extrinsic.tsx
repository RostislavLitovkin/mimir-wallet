// Copyright 2023-2023 dev.mimir authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { alpha, Box, Button, Chip, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import moment from 'moment';
import React from 'react';

import { ReactComponent as ArrowDown } from '@mimirdev/assets/svg/ArrowDown.svg';
import { AddressRow } from '@mimirdev/components';
import { useApi, useBlockTime, useSelectedAccountCallback } from '@mimirdev/hooks';
import { CalldataStatus, Transaction } from '@mimirdev/hooks/types';
import { Call } from '@mimirdev/params';
import Item from '@mimirdev/params/Param/Item';

import CallDetail from './CallDetail';
import Related from './Related';

function Extrinsic({ detailOpen, relatedTxs, toggleDetailOpen, transaction }: { relatedTxs: Transaction[]; detailOpen: boolean; toggleDetailOpen: () => void; transaction: Transaction }) {
  const destTx = transaction.top || transaction;
  const { api } = useApi();
  const status = transaction.status;
  const time = useBlockTime(transaction.status < CalldataStatus.Success ? transaction.initTransaction.height : transaction.height);
  const selectAccount = useSelectedAccountCallback();

  return (
    <Stack flex='1' spacing={1}>
      <Stack alignItems='center' direction='row' justifyContent='space-between'>
        <Stack alignItems='center' direction='row' spacing={1.25}>
          <Box sx={{ width: 8, height: 8, borderRadius: 1, bgcolor: status < CalldataStatus.Success ? 'warning.main' : status === CalldataStatus.Success ? 'success.main' : 'error.main' }} />
          <Typography color='primary.main' fontWeight={700} variant='h4'>
            No {destTx.uuid.slice(0, 8).toUpperCase()}
          </Typography>
          <Chip color='secondary' label={destTx.action} variant='filled' />
        </Stack>
        <Typography>{time ? moment(time).format() : null}</Typography>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ lineHeight: 1.5 }}>
        <Item
          content={
            <AddressRow
              defaultName={destTx.sender}
              isMe={destTx === transaction}
              onClick={(value) => value && selectAccount(value)}
              shorten={false}
              size='small'
              value={destTx.sender}
              withAddress={false}
              withCopy
              withName
            />
          }
          name='From'
          type='tx'
        />
        <Call
          api={api}
          call={destTx.call}
          selectAccount={destTx.action === 'multisig.cancelAsMulti' ? selectAccount : undefined}
          tx={destTx.action === 'multisig.cancelAsMulti' ? destTx : undefined}
          type='tx'
        />
      </Stack>
      {detailOpen ? (
        <>
          <CallDetail call={transaction.call} depositor={transaction.initTransaction.sender} />
          {relatedTxs.length > 0 && <Related relatedTxs={relatedTxs} />}
        </>
      ) : (
        <Button
          color='secondary'
          endIcon={<SvgIcon component={ArrowDown} inheritViewBox sx={{ fontSize: '0.6rem !important' }} />}
          fullWidth
          onClick={toggleDetailOpen}
          sx={({ palette }) => ({ opacity: 0.9, color: alpha(palette.secondary.contrastText, 0.5) })}
          variant='contained'
        >
          Detail
        </Button>
      )}
    </Stack>
  );
}

export default React.memo(Extrinsic);
