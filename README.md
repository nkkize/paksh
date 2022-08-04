# paksh
feathersjs 

### Services
feathers service interface as a class.  
When used as a ReST API, incming rerquests get mapped automatically to their corresponding service method.
```js
class MyService {
    // GET /my-service
    // GET /my-service?param=value
    async find(params){};

    // GET /my-service/1
    async get(id, params){};

    // POST /my-service
    async create(data, params){};

    // PUT /my-service/1
    async update(id, data, params){};

    // PATCH /my-service/1
    async patch(id, data, params){};

    // DELETE /my-service/1
    async remove(id, params){};
}

// register the service
app.use('my-service', new MyService());

// get the service object
const myService = app.service('my-service');
const resp =await myService.find();

```

#### Service Events
A registered service automatically become a NodeJS EventEmitter that sends the events with the new Data when a service method modifies the data. (create, update, patch and remove).  
These events can be listened.  
```js
create() => 'created'
update() => 'updated'
patch() => 'patched'
remove() => 'removed'

app.service('my-service').on('created', data => {})
```

### Hooks
- Hooks are pluggable middleware functions that can be registered before, after or on errors of a service method.
```js
module.exports = {
  before: {
    all: [], // special keyword, these will run before all hooks in method specific hooks
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

```
- Commonly used to handle things like validation, authorization, logging, populating related entities, sending notifications and more.  
- Hook Functions takes the hook context as the parameter and returns that context or nothing.
- they run in the order they are registered.
- if a hook function throws an error, all the remaining hooks (including the servicer call if not run yet) will be skipped and error will be returned.
```js
const createdAt = async context => {
  context.data.createdAt = new Date();
  
  return context;
};

app.service('messages').hooks({
  before: {
    create: [ createdAt ]
  }
});
```
- A common pattern the generator uses to make hooks more re-usable (e.g. making the createdAt property name from the example above configurable) is to create a wrapper function that takes those options and returns a hook function:

```js
const setTimestamp = name => {
    return async context => {
        context.data[name] = new Date();
        return context;
    }
}

app.service('messages').hooks({
  before: {
    create: [ setTimestamp('createdAt') ],
    update: [ setTimestamp('updatedAt') ]
  }
});

```
#### Hooks Context
- Readable Properties
    - context.app : to get all other services
    - context.service
    - context.path
    - context.method
    - context.type

- Writeable Properties
    - context.params - service method call params   
        - context.params.query - the query srting
    - context.id - id for get, update, patch, remove
    - context.data - the data sent by user in create, update and patch
    - context.error
    - context.result - in After hook, the result of the service method

