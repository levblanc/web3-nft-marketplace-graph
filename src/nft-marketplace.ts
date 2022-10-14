import { BigInt, Address } from '@graphprotocol/graph-ts';
import {
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
} from '../generated/NFTMarketplace/NFTMarketplace';
import {
  ActiveItem,
  ItemListed,
  ItemBought,
  ItemCanceled,
} from '../generated/schema';

export function handleItemBought(event: ItemBoughtEvent): void {
  const { buyer, tokenId, nftAddress } = event.params;
  const itemId = getIdFromEventParams(tokenId, nftAddress);

  let itemBought = ItemBought.load(itemId);
  let activeItem = ActiveItem.load(itemId);

  if (!itemBought) {
    itemBought = new ItemBought(itemId);
  }

  itemBought.buyer = buyer;
  itemBought.nftAddress = nftAddress;
  itemBought.tokenId = tokenId;
  itemBought.save();

  activeItem!.buyer = buyer;
  activeItem!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {}

export function handleItemListed(event: ItemListedEvent): void {}

const getIdFromEventParams = (tokenId: BigInt, nftAddress: Address): string => {
  return tokenId.toHexString() + nftAddress.toHexString();
};
