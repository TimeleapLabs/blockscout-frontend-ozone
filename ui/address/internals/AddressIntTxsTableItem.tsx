import { Tr, Td, Box, Flex, Skeleton } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import React from "react";

import type { InternalTransaction } from "types/api/internalTransaction";

import config from "configs/app";
import useTimeAgoIncrement from "lib/hooks/useTimeAgoIncrement";
import AddressFromTo from "ui/shared/address/AddressFromTo";
import Tag from "ui/shared/chakra/Tag";
import BlockEntity from "ui/shared/entities/block/BlockEntity";
import TxEntity from "ui/shared/entities/tx/TxEntity";
import TxStatus from "ui/shared/statusTag/TxStatus";
import { TX_INTERNALS_ITEMS } from "ui/tx/internals/utils";
import { AddressParam } from "types/api/addressParams";

type Props = InternalTransaction & {
  currentAddress: string;
  isLoading?: boolean;
};

// TODO: Move these to a config file

const EVM_WRITER_ADDRESS = "0xd100ec0000000000000000000000000000000000";
const NATIVE_MINTER_ADDRESS = "0x6d696e7400000000000000000000000000000000";

const getTypeTitle = (
  from: AddressParam,
  to: AddressParam | null,
  type: string
) => {
  if (
    from.hash.toLowerCase() === NATIVE_MINTER_ADDRESS &&
    to?.hash.toLowerCase() === EVM_WRITER_ADDRESS
  ) {
    return "Mining";
  }
  return TX_INTERNALS_ITEMS.find(({ id }) => id === type)?.title;
};

const AddressIntTxsTableItem = ({
  type,
  from,
  to,
  value,
  success,
  error,
  created_contract: createdContract,
  transaction_hash: txnHash,
  block,
  timestamp,
  currentAddress,
  isLoading,
}: Props) => {
  const typeTitle = getTypeTitle(from, to, type);
  const toData = to ? to : createdContract;

  const timeAgo = useTimeAgoIncrement(timestamp, true);

  return (
    <Tr alignItems="top">
      <Td verticalAlign="middle">
        <Flex rowGap={3} flexWrap="wrap">
          <TxEntity
            hash={txnHash}
            isLoading={isLoading}
            fontWeight={700}
            noIcon
            truncation="constant_long"
          />
          {timestamp && (
            <Skeleton
              isLoaded={!isLoading}
              color="text_secondary"
              fontWeight="400"
              fontSize="sm"
            >
              <span>{timeAgo}</span>
            </Skeleton>
          )}
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <Flex rowGap={2} flexWrap="wrap">
          {typeTitle && (
            <Box w="126px" display="inline-block">
              <Tag colorScheme="cyan" mr={5} isLoading={isLoading}>
                {typeTitle}
              </Tag>
            </Box>
          )}
          <TxStatus
            status={success ? "ok" : "error"}
            errorText={error}
            isLoading={isLoading}
          />
        </Flex>
      </Td>
      <Td verticalAlign="middle">
        <BlockEntity
          isLoading={isLoading}
          number={block}
          noIcon
          fontSize="sm"
          lineHeight={5}
          fontWeight={500}
        />
      </Td>
      <Td verticalAlign="middle">
        <AddressFromTo
          from={from}
          to={toData}
          current={currentAddress}
          isLoading={isLoading}
        />
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={!isLoading} display="inline-block" minW={6}>
          {BigNumber(value)
            .div(BigNumber(10 ** config.chain.currency.decimals))
            .toFormat()}
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(AddressIntTxsTableItem);
