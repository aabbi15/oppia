// Copyright 2018 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Model class for creating new frontend instances of Learner
 *     Action domain objects.
 */

import { StatisticsDomainConstants } from
  'domain/statistics/statistics-domain.constants';

export interface ExplorationStartCustomizationArgs {
  'state_name': {value: string};
}

export interface AnswerSubmitCustomizationArgs {
  'state_name': {value: string};
  'dest_state_name': {value: string};
  'interaction_id': {value: string};
  'submitted_answer': {value: string};
  'feedback': {value: string};
  'time_spent_state_in_msecs': {value: number};
}

export interface ExplorationQuitCustomizationArgs {
  'state_name': {value: string};
  'time_spent_in_state_in_msecs': {value: number};
}

// NOTE TO DEVELOPERS: Treat this as an implementation detail; do not export it.
// This type takes one of the values of the above customization args based
// on the type of ActionType.
type ActionCustomizationArgs<ActionType> = (
  ActionType extends 'ExplorationStart' ?
  ExplorationStartCustomizationArgs :
  ActionType extends 'AnswerSubmit' ? AnswerSubmitCustomizationArgs :
  ActionType extends 'ExplorationQuit' ?
  ExplorationQuitCustomizationArgs : never);

// NOTE TO DEVELOPERS: Treat this as an implementation detail; do not export it.
// This interface takes the type of backend dict according to the ActionType
// parameter.
interface LearnerActionBackendDictBase<ActionType> {
  'action_type': ActionType;
  'action_customization_args': ActionCustomizationArgs<ActionType>;
  'schema_version': number;
}

export enum LearnerActionType {
  ExplorationStart = 'ExplorationStart',
  AnswerSubmit = 'AnswerSubmit',
  ExplorationQuit = 'ExplorationQuit',
}

export type ExplorationStartLearnerActionBackendDict = (
  LearnerActionBackendDictBase<LearnerActionType.ExplorationStart>);

export type AnswerSubmitLearnerActionBackendDict = (
  LearnerActionBackendDictBase<LearnerActionType.AnswerSubmit>);

export type ExplorationQuitLearnerActionBackendDict = (
  LearnerActionBackendDictBase<LearnerActionType.ExplorationQuit>);

export type LearnerActionBackendDict = (
  ExplorationStartLearnerActionBackendDict |
  AnswerSubmitLearnerActionBackendDict |
  ExplorationQuitLearnerActionBackendDict);

// NOTE TO DEVELOPERS: Treat this as an implementation detail; do not export it.
// This class takes the type according to the LearnerActionType parameter.
class LearnerActionBase<LearnerActionType> {
  constructor(
    public readonly actionType: LearnerActionType,
    public actionCustomizationArgs: ActionCustomizationArgs<LearnerActionType>,
    public schemaVersion: number
  ) {}

  toBackendDict(): LearnerActionBackendDictBase<LearnerActionType> {
    return {
      action_type: this.actionType,
      action_customization_args: this.actionCustomizationArgs,
      schema_version: this.schemaVersion,
    };
  }
}

export class ExplorationStartLearnerAction extends
  LearnerActionBase<LearnerActionType.ExplorationStart> {}

export class AnswerSubmitLearnerAction extends
  LearnerActionBase<LearnerActionType.AnswerSubmit> {}

export class ExplorationQuitLearnerAction extends
  LearnerActionBase<LearnerActionType.ExplorationQuit> {}

export type LearnerAction = (
  ExplorationStartLearnerAction |
  AnswerSubmitLearnerAction |
  ExplorationQuitLearnerAction);

export class LearnerActionModel {
  static createNewExplorationStartAction(
      actionCustomizationArgs: ExplorationStartCustomizationArgs
  ): ExplorationStartLearnerAction {
    return new ExplorationStartLearnerAction(
      LearnerActionType.ExplorationStart, actionCustomizationArgs,
      StatisticsDomainConstants.LEARNER_ACTION_SCHEMA_LATEST_VERSION);
  }

  static createNewAnswerSubmitAction(
      actionCustomizationArgs: AnswerSubmitCustomizationArgs
  ): AnswerSubmitLearnerAction {
    return new AnswerSubmitLearnerAction(
      LearnerActionType.AnswerSubmit, actionCustomizationArgs,
      StatisticsDomainConstants.LEARNER_ACTION_SCHEMA_LATEST_VERSION);
  }

  static createNewExplorationQuitAction(
      actionCustomizationArgs: ExplorationQuitCustomizationArgs
  ): ExplorationQuitLearnerAction {
    return new ExplorationQuitLearnerAction(
      LearnerActionType.ExplorationQuit, actionCustomizationArgs,
      StatisticsDomainConstants.LEARNER_ACTION_SCHEMA_LATEST_VERSION);
  }

  /**
   * @typedef LearnerActionBackendDict
   * @property {string} actionType - type of an action.
   * @property {Object.<string, *>} actionCustomizationArgs - customization
   *   dict for an action.
   * @property {number} schemaVersion - schema version of the class instance.
   *   Defaults to the latest schema version.
   */

  /**
   * @param {LearnerActionBackendDict} learnerActionBackendDict
   * @returns {LearnerAction}
   */
  static createFromBackendDict(
      learnerActionBackendDict: LearnerActionBackendDict): LearnerAction {
    switch (learnerActionBackendDict.action_type) {
      case LearnerActionType.ExplorationStart:
        return new ExplorationStartLearnerAction(
          learnerActionBackendDict.action_type,
          learnerActionBackendDict.action_customization_args,
          learnerActionBackendDict.schema_version);
      case LearnerActionType.AnswerSubmit:
        return new AnswerSubmitLearnerAction(
          learnerActionBackendDict.action_type,
          learnerActionBackendDict.action_customization_args,
          learnerActionBackendDict.schema_version);
      case LearnerActionType.ExplorationQuit:
        return new ExplorationQuitLearnerAction(
          learnerActionBackendDict.action_type,
          learnerActionBackendDict.action_customization_args,
          learnerActionBackendDict.schema_version);
      default:
        break;
    }
    const invalidBackendDict: never = learnerActionBackendDict;
    throw new Error(
      'Backend dict does not match any known action type: ' +
      angular.toJson(invalidBackendDict));
  }
}
