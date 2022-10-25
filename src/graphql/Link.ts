import { extendType, nonNull, objectType, stringArg } from "nexus";   
import { NexusGenObjects } from "../../nexus-typegen"; 
export const Link = objectType({
    name: "Link", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("description"); 
        t.nonNull.string("url"); 
    },
});

let links: NexusGenObjects["Link"][]= [   
    {
        id: 1,
        url: "www.howtographql.com",
        description: "Fullstack tutorial for GraphQL",
    },
    {
        id: 2,
        url: "graphql.org",
        description: "GraphQL official website",
    },
];

export const LinkQuery = extendType({  
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {   
            type: "Link",
            resolve(parent, args, context, info) {    
                return links;
            },
        });
        t.nonNull.list.nonNull.field("feedById", {
            type: "Link",
            args: {
                id: nonNull(stringArg()),
            },
            resolve(parent, args, context, info) {
                return links.filter((link) => link.id === Number(args.id));
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
                const { description, url } = args;  // 4
                
                let idCount = links.length + 1;  // 5
                const link = {
                    id: idCount,
                    description: description,
                    url: url,
                };
                links.push(link);
                return link;
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
                const { id, description, url } = args;
                const link = links.find((link) => link.id === Number(id));
                if (link) {
                    link.description = description;
                    link.url = url;
                }
                return link;
            }
        });

        // Delete a link mutation
        t.nonNull.field("deleteLink", {
            type: "Link",
            args: {
                id: nonNull(stringArg()),
            },
            resolve(parent, args, context) {
                const { id } = args;
                const link = links.find((link) => link.id === Number(id));
                if (link) {
                    links = links.filter((link) => link.id !== Number(id));
                }
                return link;
            }
        });
    },
});
