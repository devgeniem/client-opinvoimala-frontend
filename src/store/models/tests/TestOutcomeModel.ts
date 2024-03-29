import { SnapshotOut, types } from 'mobx-state-tree';
import { CardModel, ImageModel, LinkModel } from '..';

export const TestOutcomeModel = types.model({
  id: types.identifierNumber,
  title: types.maybeNull(types.string),
  content: types.maybeNull(types.string),
  image: types.maybeNull(ImageModel),
  stars: types.maybeNull(types.number),
  // TODO: Link list
});

export interface TestOutcome extends SnapshotOut<typeof TestOutcomeModel> {}

export const TestOutcomesModel = types.model({
  id: types.identifierNumber, // Test ID
  slug: types.string, // Test slug
  points: types.maybeNull(types.number),
  maximumPoints: types.maybeNull(types.number),
  stars: types.maybeNull(types.number),
  matchingOutcomes: types.array(TestOutcomeModel),
  triggerOutcomes: types.array(TestOutcomeModel),
  allOutcomes: types.maybeNull(types.array(TestOutcomeModel)),
  cardsTitle: types.maybeNull(types.string),
  cards: types.maybeNull(types.array(CardModel)),
  linkListTitle: types.maybeNull(types.string),
  linkList: types.array(LinkModel),
});

export interface TestOutcomes extends SnapshotOut<typeof TestOutcomesModel> {}
