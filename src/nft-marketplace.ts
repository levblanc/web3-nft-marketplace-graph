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

export function handleItemCanceled(event: ItemCanceledEvent): void {
  const { seller, tokenId, nftAddress } = event.params;
  const itemId = getIdFromEventParams(tokenId, nftAddress);

  let itemCanceled = ItemCanceled.load(itemId);
  let activeItem = ActiveItem.load(itemId);

  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(itemId);
  }

  itemCanceled.seller = seller;
  itemCanceled.tokenId = tokenId;
  itemCanceled.nftAddress = nftAddress;
  itemCanceled.save();

  // the dead address
  activeItem!.buyer = Address.fromString(
    '0x000000000000000000000000000000000000dEaD'
  );
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  const { seller, tokenId, nftAddress, price } = event.params;
  const itemId = getIdFromEventParams(tokenId, nftAddress);

  let itemListed = ItemListed.load(itemId);
  let activeItem = ActiveItem.load(itemId);

  if (!itemListed) {
    itemListed = new ItemListed(itemId);
  }

  if (!activeItem) {
    activeItem = new ActiveItem(itemId);
  }

  itemListed.seller = seller;
  itemListed.tokenId = tokenId;
  itemListed.nftAddress = nftAddress;
  itemListed.price = price;
  itemListed.save();

  // empty address
  activeItem.buyer = Address.fromString(
    '0x0000000000000000000000000000000000000000'
  );
  activeItem.seller = seller;
  activeItem.tokenId = tokenId;
  activeItem.nftAddress = nftAddress;
  activeItem.price = price;
  activeItem.save();
}

const getIdFromEventParams = (tokenId: BigInt, nftAddress: Address): string => {
  return tokenId.toHexString() + nftAddress.toHexString();
};
