import DateScalar from './DateScalar';
import ClassResolver from './ClassResolver';
import SkillResolver from './SkillResolver';
import AbilityResolver from './AbilityResolver';
import QuestResolver from './QuestResolver';
import MissionResolver from './MissionResolver';
import QueryResolver from './QueryResolver';
import MutationResolver from './MutationResolver';
import CardResolver from './CardResolver';
import MapResolver from './MapResolver';
import EnemyResolver from './EnemyResolver';
import SkillInfluenceConfigResolver from './SkillInfluenceConfig';
import AbilityConfigResolver from './AbilityConfigResolver';

export default {
  Date: DateScalar,
  Class: ClassResolver,
  Card: CardResolver,
  Skill: SkillResolver,
  Ability: AbilityResolver,
  Quest: QuestResolver,
  Mission: MissionResolver,
  Map: MapResolver,
  Query: QueryResolver,
  Mutation: MutationResolver,
  Enemy: EnemyResolver,
  SkillInfluenceConfig: SkillInfluenceConfigResolver,
  AbilityConfig: AbilityConfigResolver,
};
