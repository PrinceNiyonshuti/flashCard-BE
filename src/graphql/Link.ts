import { extendType, nonNull, objectType, stringArg } from "nexus";   
import { NexusGenObjects } from "../../nexus-typegen"; 
export const Link = objectType({
    name: "Link", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("description"); 
        t.nonNull.string("url"); 
        t.field("postedBy", {   // 1
            type: "User",
            resolve(parent, args, context) {  // 2
                return context.prisma.link
                    .findUnique({ where: { id: parent.id } })
                    .postedBy();
            },
        });
    },
});


export const LinkQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   
            type: "Link",
            resolve(parent, args, context, info) {    
                return context.prisma.link.findMany();
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
        t.nonNull.field("post", {  // 2
            type: "Link",  
            args: {   // 3
                description: nonNull(stringArg()),
                url: nonNull(stringArg()),
            },
            
            resolve(parent, args, context) {    
                const newLink = context.prisma.link.create({   // 2
                    data: {
                        description: args.description,
                        url: args.url,
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
