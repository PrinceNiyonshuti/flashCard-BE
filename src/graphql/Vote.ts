import { objectType, extendType, nonNull, intArg } from "nexus";

export const Vote = objectType({  // 1
    name: "Vote",
    definition(t) {
        t.nonNull.field("link", { type: "Link" });
        t.nonNull.field("user", { type: "User" });
    },
});

export const VoteMutation = extendType({  // 2
    type: "Mutation",
    definition(t) {
        t.field("vote", {
            type: "Vote",
            args: {
                linkId: nonNull(intArg()),
            },
            
        })
    }
})
