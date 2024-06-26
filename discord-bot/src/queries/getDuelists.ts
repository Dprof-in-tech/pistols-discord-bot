import * as ql from "../generated/graphql.js";
import { sdk } from "../config.js";
import { bigintToHex, feltToString } from "../utils/misc.js";
import { BigNumberish } from "starknet";

export const getDuelistByAddress = async (address: BigNumberish): Promise<ql.Duelist | null> => {
  try {
    const { data } = await sdk.getDuelistsByAddress({
      address: bigintToHex(address),
    });
    return parseDuelistResponse(data)
  } catch (error) {
    console.error("getDuelistByAddress() failed!", error);
    throw error;
  }
}

const parseDuelistResponse = (
  data: ql.GetDuelistsByAddressQuery
): ql.Duelist | null => {
  if (
    data?.duelistModels?.edges?.length &&
    data.duelistModels.edges.length > 0
  ) {
    const duelist = data.duelistModels.edges[0]?.node;
    if (duelist) {
      return {
        ...duelist,
        name: feltToString(duelist.name),
      };
    }
  }
  return null;
};