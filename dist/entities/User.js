"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Team_1 = require("./Team");
const Message_1 = require("./Message");
const Channel_1 = require("./Channel");
const PrivateChannelMember_1 = require("./PrivateChannelMember");
const DirectMessage_1 = require("./DirectMessage");
const Member_1 = require("./Member");
let User = class User extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.OneToMany(() => Team_1.Team, (team) => team.creator),
    __metadata("design:type", Array)
], User.prototype, "teams", void 0);
__decorate([
    typeorm_1.OneToMany(() => Channel_1.Channel, (channel) => channel.users),
    __metadata("design:type", Array)
], User.prototype, "channels", void 0);
__decorate([
    typeorm_1.OneToMany(() => DirectMessage_1.DirectMessage, (directMessage) => directMessage.creator),
    __metadata("design:type", Array)
], User.prototype, "directMessages", void 0);
__decorate([
    typeorm_1.OneToMany(() => Message_1.Message, (message) => message.creator),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
__decorate([
    typeorm_1.OneToMany(() => Member_1.Member, (member) => member.user),
    __metadata("design:type", Array)
], User.prototype, "members", void 0);
__decorate([
    typeorm_1.OneToMany(() => PrivateChannelMember_1.PrivateChannelMember, (pcMember) => pcMember.user),
    __metadata("design:type", Array)
], User.prototype, "privateChannelMembers", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean),
    __metadata("design:type", Boolean)
], User.prototype, "isYou", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map