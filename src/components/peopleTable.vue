<template>
  <div>
    <div v-if="$apollo.loading">
      Loading...
    </div>
    <div v-else-if="!listPersons.items.length">
      No data
    </div>
    <table v-else>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>D.O.B.</th>
        <th></th>
      </tr>
      <tr
        v-for="item in listPersons.items"
        :key="item.id"
        :class="{'optimistic-update': typeof item.id === 'number'}"
      >
        <td>{{item.name}}</td>
        <td>{{item.email}}</td>
        <td>{{item.phone}}</td>
        <td>{{item.DOB}}</td>
        <td>
          <button @click="handleDelete(item)">X</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { listPersons } from '@/graphql/queries'
import { deletePerson } from '@/graphql/mutations'
import { onCreatePerson, onDeletePerson } from '@/graphql/subscriptions'
export default {

  name: 'PeopleTable',

  data () {
    return {
      listPersons: { items: [] }
    }
  },
  apollo: {
    listPersons: {
      query: gql(listPersons),
      subscribeToMore: [
        {
          document: gql(onCreatePerson),
          updateQuery(prev, { subscriptionData: {data} }){

            // this will stop a duplicate person being added in the browser that made the change
            const idInListAlready = prev.listPersons.items.some(person => person.id === data.onCreatePerson.id)
            if (idInListAlready) {
              return prev
            }

            return {
              listPersons: {
                ...prev.listPersons,
                items: prev.listPersons.items.concat([data.onCreatePerson])
              }
            }
          }
        },
        {
          document: gql(onDeletePerson),
          updateQuery(prev, { subscriptionData: {data} }){

            return {
              listPersons: {
                ...prev.listPersons,
                items: prev.listPersons.items.filter(person => person.id !== data.onDeletePerson.id)
              }
            }
          }
        },
      ],
    }

  },
  methods: {
    handleDelete(person) {
      this.$apollo.mutate({
        mutation: gql(deletePerson),
        variables: { input: { id: person.id } },
        optimisticResponse: {
          __typename: 'Mutation',
          deletePerson: person
        },
        update(cache, {data: deletePerson}){
          // read the data from the cache for this query
          const query = cache.readQuery({query: gql(listPersons)})

          // remove our person from the mutation to the end
          query.listPersons.items = query.listPersons.items.filter(item =>
            item.id !== deletePerson.deletePerson.id
          );

          // write the data back to the cache
          cache.writeQuery({
            query: gql(listPersons),
            data: query
          })
        }
      })
      .catch(e => console.log(e.message))
    }
  }
}
</script>

<style lang="css" scoped>
table {
  width: 500px;
  border: 1px solid black;
  border-collapse: collapse;
}

td, th {
  border: 1px solid black;
  padding: 3px;
}

.optimistic-update {
  background-color: #d5daff;
}
</style>