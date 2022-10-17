
import {Projects} from "../models/Project.js";
import {Clients} from "../models/Client.js";

import {
    GraphQLEnumType,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from "graphql";


const ClientType = new GraphQLObjectType({
    name:'Client',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        phone: {type: GraphQLString},
    })
});

const ProjectType = new GraphQLObjectType({
    name:'Project',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        status: {type: GraphQLString},
        client:{
            type:ClientType,
            resolve(parent, args){
                return Clients.findById(parent.clientId);

            }

        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',

    fields: {
        projects:{
            type: new GraphQLList(ProjectType),
            resolve(parent, args){
                return Projects.find()
            }
        },
        project : {
            type : ProjectType,
            args : {
                id: {type : GraphQLID}
            },

            resolve(parent,args){
                return Projects.findById(args.id);
            }
        },

        clients:{
            type: new GraphQLList(ClientType),
            resolve(parent, args){
                return Clients.find();
            }
        },
        client : {
            type : ClientType,
            args : {
                id: {type : GraphQLID}
            },

            resolve(parent,args){
                return Clients.findById(args.id);
            }
        }

    }
});


//mutations
const mutation = new GraphQLObjectType({
    name:"Mutation",
    fields: {
        addClient: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                email: {type: GraphQLNonNull(GraphQLString)},
                phone: {type: GraphQLNonNull(GraphQLString)},

            },

            resolve(parent, args) {
                const client = new Clients({
                    name: args.name,
                    email: args.email,
                    phone: args.phone,
                });

                return client.save()

            }
        },
        //delete client
        deleteClient:{
            type: ClientType,
            args: {
                id: {
                    type: GraphQLNonNull(GraphQLID)
                }
            },
            resolve(parent, args){
                return Clients.findByIdAndRemove(args.id)
            }

        },

        // Add project
        addProject: {
            type: ProjectType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLNonNull(GraphQLString)},
                status: {type: new GraphQLEnumType ({
                        name : 'ProjectStatus',
                        values:{
                            'new': {value: 'Not Started'},
                            'progress': {value: 'In Progress'},
                            'completed': {value: 'Completed'},
                        }
                    }),
                    defaultValue : 'Not Started'
                },
                clientId : {
                    type: GraphQLNonNull(GraphQLID)
                }
            },

            resolve(parent, args) {
                const project = new Projects({
                    name: args.name,
                    description: args.description,
                    status: args.status,
                    clientId: args.clientId,
                });

                return project.save();

            }
        },
    }
})

export const schema = new GraphQLSchema(({
    query : RootQuery,
    mutation
}))