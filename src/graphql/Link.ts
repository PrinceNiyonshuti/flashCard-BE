import { extendType, nonNull, objectType, stringArg, intArg, inputObjectType, enumType, arg, list } from "nexus";
import { Prisma } from "@prisma/client"

export const Link = objectType({
    name: "Link", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("description"); 
        t.nonNull.string("url"); 
         t.nonNull.dateTime("createdAt");  // 1
        t.field("postedBy", {   // 1
            type: "User",
            resolve(parent, args, context) {  // 2
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
        t.nonNull.list.nonNull.field("voters", {  // 1
            type: "User",
            resolve(parent, args, context) {
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .voters();
            }
        });
    },
});

export const LinkOrderByInput = inputObjectType({
    name: "LinkOrderByInput",
    definition(t) {
        t.field("description", { type: Sort });
        t.field("url", { type: Sort });
        t.field("createdAt", { type: Sort });
    },
});

export const Sort = enumType({
    name: "Sort",
    members: ["asc", "desc"],
});


export const LinkQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   
            type: "Link",
            args: {
                filter: stringArg(),   // 1
                skip: intArg(),   // 1
                take: intArg(),   // 1 
                orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }),
            },
            resolve(parent, args, context) {
                const where = args.filter   // 2
                    ? {
                          OR: [
                              { description: { contains: args.filter } },
                              { url: { contains: args.filter } },
                          ],
                      }
                    : {};
                return context.prisma.link.findMany({
                    where,
                    skip: args?.skip as number | undefined,    // 2
                    take: args?.take as number | undefined,    // 2
                    orderBy: args?.orderBy as Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput> | undefined,  // 2
                });
            },
        });
        t.nonNull.list.nonNull.field("feedById", {
            type: "Link",
            args: {
                id: nonNull(stringArg()),
            },
            resolve(parent, args, context, info) {
                return context.prisma.link.findMany({
                    where: {
                        id: parseInt(args.id),
                    },
                });
            }
        });
    },
});

export const LinkMutation = extendType({  // 1
    type: "Mutation",
    definition(t) {
        t.nonNull.field("post", {
            type: "Link",
            args: {
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent, args, context) {   
                const { description, url } = args;
                const { userId } = context;

                if (!userId) {  // 1
                    throw new Error("Cannot post without logging in.");
                }

                const newLink = context.prisma.link.create({
                    data: {
                        description,
                        url,
                        postedBy: { connect: { id: userId } },  // 2
                    },
                });

                return newLink;
            },
        });

        // update link mutation 
        t.nonNull.field("updateLink", {
            type: "Link",
            args: {
                id: nonNull(stringArg()),
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                return context.prisma.link.update({
                    where: {
                        id: parseInt(args.id),
                    },
                    data: {
                        description: args.description,
                        url: args.url,
                    },
                });
            },
        });

        // Delete a link mutation
        t.nonNull.field("deleteLink", {
            type: "Link",
            args: {
                id: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                return context.prisma.link.delete({
                    where: {
                        id: parseInt(args.id),
                    },
                });
            }
        });
    },
});
