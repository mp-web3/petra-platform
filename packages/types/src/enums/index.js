"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanDuration = exports.OrderStatus = exports.SubscriptionPlanType = exports.SubscriptionStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["CLIENT"] = "CLIENT";
    UserRole["COACH"] = "COACH";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["CANCELLED"] = "CANCELLED";
    SubscriptionStatus["PAST_DUE"] = "PAST_DUE";
    SubscriptionStatus["TRIALING"] = "TRIALING";
    SubscriptionStatus["INCOMPLETE"] = "INCOMPLETE";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
var SubscriptionPlanType;
(function (SubscriptionPlanType) {
    SubscriptionPlanType["WOMAN_STARTER"] = "WOMAN_STARTER";
    SubscriptionPlanType["WOMAN_PREMIUM"] = "WOMAN_PREMIUM";
    SubscriptionPlanType["MAN_STARTER"] = "MAN_STARTER";
    SubscriptionPlanType["MAN_PREMIUM"] = "MAN_PREMIUM";
})(SubscriptionPlanType || (exports.SubscriptionPlanType = SubscriptionPlanType = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["FAILED"] = "FAILED";
    OrderStatus["REFUNDED"] = "REFUNDED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PlanDuration;
(function (PlanDuration) {
    PlanDuration["WEEKS_6"] = "6W";
    PlanDuration["WEEKS_18"] = "18W";
    PlanDuration["WEEKS_36"] = "36W";
})(PlanDuration || (exports.PlanDuration = PlanDuration = {}));
