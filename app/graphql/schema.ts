import { gql } from 'apollo-server-koa';
export default gql`
  scalar Date

  "文件信息"
  type File {
    "文件名"
    Name: String!
    "链接"
    Link: String!
  }

  "单位信息"
  type Card {
    CardID: Int!
    "初始职业id"
    InitClassID: Int!
    "职业"
    Class: Classes
    "初始技能id"
    ClassLV0SkillID: Int!
    "初始技能"
    SkillInit: [Skill]
    "cc后技能id"
    ClassLV1SkillID: Int!
    "cc后技能"
    SkillCC: [Skill]
    "觉醒技能id"
    EvoSkillID: Int!
    "觉醒技能"
    SkillEvo: [Skill]
    Kind: Int!
    "稀有度，0-7为铁铜银金白黑空蓝"
    Rare: Int!
    "卖了的钱"
    SellPrice: Int!
    "吃了的经验"
    BuildExp: Int!
    "好感1的种类"
    BonusType: Int!
    "好感1的数值"
    BonusNum: Int!
    "好感2的种类"
    BonusType2: Int!
    "好感2的数值"
    BonusNum2: Int!
    "比基础c提高的c"
    CostModValue: Int!
    "可以减的c"
    CostDecValue: Int!
    "hp补正"
    MaxHPMod: Int!
    "攻击补正"
    AtkMod: Int!
    "防御补正"
    DefMod: Int!
    "画师"
    Illust: String!
    "画师id"
    IllustID: Int!
    "魔抗"
    MagicResistance: Int!
    "觉醒被动id"
    Ability: Int!
    "觉醒被动"
    AbilityEvoInfo: Ability!
    "初始被动id"
    Ability_Default: Int!
    "初始被动"
    AbilityInitInfo: Ability!
    "种族id"
    _TypeRace: Int!
    "种族"
    Race: String
    Assign: String
    Identity: String
    "卖了给的虹水"
    _TradePoint: Int!
    "二觉方向"
    _AwakePattern: Int!
    Flavor: Int!
    "名称"
    Name: String
    "立绘"
    ImageStand: [String]
    "HCG"
    ImageCG: [String]
    "点阵"
    Dots: [Dot]
    HarlemTextA: [String]
    HarlemTextR: [String]
    NickName: [String]
    ConneName: String
    Talks: [String]
  }

  "quest信息"
  type Quest {
    QuestID: Int!
    "名称"
    Name: String!
    QuestTitle: Int!
    Text: Int!
    Type: Int!
    "魅力消耗"
    Charisma: Int!
    "体力"
    ActionPoint: Int!
    Rank: Int!
    "地图补正"
    Level: Int!
    RankExp: Int!
    Gold: Int!
    MapNo: Int!
    Map: Map
    EntryNo: Int!
    "掉落1"
    Treasure1: Int!
    "掉落2"
    Treasure2: Int!
    "掉落3"
    Treasure3: Int!
    "掉落4"
    Treasure4: Int!
    "掉落5，可能为com"
    Treasure5: Int!
    "mission信息"
    Mission: Mission
    Message: String!
  }

  "mission信息"
  type Mission {
    "名称"
    Name: String!
    MissionID: Int!
    "种类"
    Type: String!
    "包含的quests"
    Quests: [Quest]
    Enemies: [Enemy]
    BattleTalks: [BattleTalk]
  }

  type Db {
    Exist: Boolean!
    UpdateTime: Date
    Name: String!
  }

  "技能信息"
  type Skill {
    SkillID: Int
    "技能名"
    SkillName: String!
    "再动"
    WaitTime: Int!
    "持续"
    ContTime: Int!
    "最大持续"
    ContTimeMax: Int!
    "数值"
    Power: Int!
    "最大数值"
    PowerMax: Int!
    "最大等级"
    LevelMax: Int!
    SkillType: Int!
    "技能说明id"
    ID_Text: Int!
    "技能说明"
    Text: String
    "技能效果"
    InfluenceConfig: [SkillInfluenceConfig]
    CardHave: [Card]
  }

  type SkillInfluenceConfig {
    Data_ID: Int!
    Type_Collision: Int!
    Type_CollisionState: Int!
    Type_ChangeFunction: Int!
    Data_Target: Int!
    Data_InfluenceType: Int!
    Description: String
    Data_MulValue: Int!
    Data_MulValue2: Int!
    Data_MulValue3: Int!
    Data_AddValue: Int!
    _HoldRatioUpperLimit: Int!
    _Expression: String!
    _ExpressionActivate: String!
  }

  type SkillInfluenceMeta {
    ID: Int!
    Description: String!
  }

  type AbilityConfigMeta {
    ID: Int!
    Description: String!
  }

  "被动信息"
  type Ability {
    "被动名称"
    AbilityName: String!
    "被动数值"
    AbilityPower: Int!
    AbilityType: Int!
    "被动说明id"
    AbilityTextID: Int!
    "被动说明"
    Text: String!
    "被动效果id"
    _ConfigID: Int!
    "被动效果"
    Config: [AbilityConfig]
    AbilityID: Int!
    CardHave: [Card]
  }

  "被动效果"
  type AbilityConfig {
    _ConfigID: Int!
    _InvokeType: Int!
    _TargetType: Int!
    _InfluenceType: Int!
    "参数1"
    _Param1: Int!
    "参数2"
    _Param2: Int!
    "参数3"
    _Param3: Int!
    "参数4"
    _Param4: Int!
    _Command: String!
    _ActivateCommand: String!
    Description: String
  }

  "职业信息"
  type Class {
    ClassID: Int!
    "名称"
    Name: String!
    "最大等级"
    MaxLevel: Int!
    "单位该职业最大等级"
    MaxLevelUnit: Int
    "基础C"
    Cost: Int!
    "基础HP"
    InitHP: Int!
    "最大HP"
    MaxHP: Int!
    "攻击方式"
    AttackType: Int!
    "基础攻击"
    InitAtk: Int!
    "最大攻击"
    MaxAtk: Int!
    "最大目标数"
    MaxTarget: Int!
    "初始防御"
    InitDef: Int!
    "最大防御"
    MaxDef: Int!
    "射程"
    AtkArea: Int!
    "CC目标id"
    JobChange: Int!
    "cc素材1"
    JobChangeMaterial1: Int!
    "cc素材2"
    JobChangeMaterial2: Int!
    "cc素材3"
    JobChangeMaterial3: Int!
    "觉醒珠子1"
    Data_ExtraAwakeOrb1: Int!
    "觉醒珠子2"
    Data_ExtraAwakeOrb2: Int!
    "档数"
    BlockNum: Int!
    "后摇"
    AttackWait: Int!
    "职业说明"
    Explanation: String!
    "二觉a职业id"
    AwakeType1: Int!
    "二觉b职业id"
    AwakeType2: Int!
    NickName: [String]
    JobChangeMaterial: [Class]
    Data_ExtraAwakeOrb: [Class]
    ClassAbilityConfig1: [AbilityConfig]
    ClassAbilityPower1: Int!
  }

  "职业列表"
  type Classes {
    "初始职业"
    ClassInit: Class
    "CC职业"
    ClassCC: Class
    "觉醒职业"
    ClassEvo: Class
    "二觉职业a"
    ClassEvo2a: Class
    "二觉职业b"
    ClassEvo2b: Class
  }

  type Entry {
    EntryID: Int!
    EnemyID: Int!
    Wait: Int!
    RouteNo: Int!
    Loop: Int!
    "补正"
    Level: Int!
    PrizeEnemySpawnPercent: Int!
    PrizeCardID: Int!
    PrizeEnemyDropPercent: Int!
    RouteOffset: Int!
    IsAppear: String
    FreeCommand: String
    EntryCommand: String
    DeadCommand: String
  }

  type Location {
    LocationID: Int!
    ObjectID: Int!
    X: Int!
    Y: Int!
  }

  type Enemy {
    SpecialEffect: Int!
    PatternID: Int!
    Type: Int!
    Attribute: Int!
    Weather: Int!
    HP: Int!
    HP_MAX: Int!
    ATTACK_POWER: Int!
    ATTACK_TYPE: Int!
    ATTACK_RANGE: Int!
    ATTACK_SPEED: Int!
    ARMOR_DEFENSE: Int!
    MAGIC_DEFENSE: Int!
    MOVE_SPEED: Int!
    SKILL: Int!
    SkyFlag: Int!
    GainCost: Int!
    EffectHeight: Int!
    MagicAttack: Int!
    AttackWait: Int!
    MissileID: Int!
    DeadEffect: Int!
    Param_ResistanceAssassin: Int!
    Param_ChangeParam: Int!
    Param_ChangeCondition: Int!
    _Attribute: String!
    TypeAttack: Int!
    HeightOfs_Paralisys: Int!
    Types: [String]!
  }

  type Map {
    Image: String
    Entries: [Entries]
    Locations: [Locations]
  }

  type Entries {
    EntryID: Int!
    Entries: [Entry]
  }

  type Locations {
    LocationID: Int!
    Locations: [Location]
  }

  type Dot {
    "名字"
    Name: String!
    "长度"
    Length: Int!
    Entries: [DotEntry]!
    "图片链接"
    Image: String!
  }

  type DotEntry {
    Name: String!
    Sprites: [Sprite]!
    PatternNo: [Pattern]!
  }

  type Pattern {
    Time: Int
    Data: Int!
  }

  type Sprite {
    X: Int!
    Y: Int!
    Width: Int!
    Height: Int!
    OriginX: Int!
    OriginY: Int!
  }

  type BattleTalk {
    Message: String
    Name: String
    FaceID: Int
    RecordOffset: Int
    RecordIndex: Int
  }

  type Emoji {
    _id: String!
    name: [String]
    emoji: [String]
    group: [Int]
  }
  type Log {
    Message: String
    Level: String
  }

  type FileDiff {
    newFiles: [File]
    modifiedFiles: [File]
    deletedFiles: [File]
  }

  type Query {
    file(name: String, link: String): File
    files: [File]
    card(CardID: Int!): Card
    cards(Rare: Int, Name: String, InitClassID: Int): [Card]
    ability(AbilityID: Int!): Ability
    abilities: [Ability]
    quest(QuestID: Int!): Quest
    quests: [Quest]
    mission(MissionID: Int!): Mission
    missions: [Mission]
    uploadFiles: [Db]
    map(MapID: Int!): Map
    battleTalks: [BattleTalk]!
    classes(MaterialID: Int): [Class]
    class(Name: String, ClassID: Int): Class
    skills: [Skill]
    skillInfluenceMetas: [SkillInfluenceMeta]
    abilityConfigMetas: [AbilityConfigMeta]
    emojis: [Emoji]
    "服务器状态，0为空闲，1为忙，2为错误"
    serverStatus: Int!
    logs: [Log]
    posters: [String]
    fileDiff: FileDiff
  }

  type Mutation {
    downloadFiles: Boolean!
    updateCardMeta(CardID: Int!, ConneName: String, NickName: [String]): Card!
    updateClassMeta(ClassID: Int!, NickName: [String]): Class!
    updateSkillInfluenceMeta(ID: Int!, Description: String): Boolean!
    updateAbilityConfigMeta(ID: Int!, Description: String): Boolean!
    removeEmoji(ID: String!): Boolean!
    removeEmojiItem(ID: String!, index: Int!): Boolean!
  }

  type Subscription {
    logAdded: Log
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
