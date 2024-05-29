import { Tr, Td, Box, Flex, Skeleton } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
import React from "react";

import type { InternalTransaction } from "types/api/internalTransaction";

import config from "configs/app";
import AddressFromTo from "ui/shared/address/AddressFromTo";
import Tag from "ui/shared/chakra/Tag";
import TxStatus from "ui/shared/statusTag/TxStatus";
import { TX_INTERNALS_ITEMS } from "ui/tx/internals/utils";
import { AddressParam } from "types/api/addressParams";

type Props = InternalTransaction & {
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

const TxInternalTableItem = ({
  type,
  from,
  to,
  value,
  success,
  error,
  gas_limit: gasLimit,
  created_contract: createdContract,
  isLoading,
}: Props) => {
  const typeTitle = getTypeTitle(from, to, type);
  const toData = to ? to : createdContract;

  return (
    <Tr alignItems="top">
      <Td>
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
        <AddressFromTo from={from} to={toData} isLoading={isLoading} />
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={!isLoading} display="inline-block">
          {BigNumber(value)
            .div(BigNumber(10 ** config.chain.currency.decimals))
            .toFormat()}
        </Skeleton>
      </Td>
      <Td isNumeric verticalAlign="middle">
        <Skeleton isLoaded={!isLoading} display="inline-block">
          {BigNumber(gasLimit).toFormat()}
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(TxInternalTableItem);
