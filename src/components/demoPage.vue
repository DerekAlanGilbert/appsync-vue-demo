<template>
  <div class="container">
    <vue-form-generator
      :schema="schema"
      :model="model"
      class="form"
    />
    <people-table />
  </div>

</template>

<script>
import gql from 'graphql-tag'
import PeopleTable from '@/components/peopleTable'
import { createPerson } from '@/graphql/mutations'
import { listPersons } from '@/graphql/queries'
export default {
  name: 'DemoPage',
  components: {
    PeopleTable
  },
  data () {
    return {
      model: {},
      schema: {
        fields: [
          {
            type: "input",
            inputType: "text",
            label: "Name",
            model: "name",
            placeholder: "Your name",
            required: true
          },
          {
            type: "input",
            inputType: "email",
            label: "Email",
            model: "email",
            placeholder: "Your email"
          },
          {
            type: "input",
            inputType: "text",
            label: "Phone",
            model: "phone",
            placeholder: "Your phone number"
          },
          {
            type: "input",
            inputType: "date",
            label: "D.O.B.",
            model: "DOB",
            placeholder: "Your date of birth"
          },
          {
            type: "submit",
            inputType: "submit",
            onSubmit: this.handleSubmit
          }
        ]
      }
    }
  },
  methods: {
    handleSubmit (person) {
      this.$apollo.mutate({
        mutation: gql(createPerson),
        variables: { input: this.model },
        optimisticResponse: {
          __typename: 'Mutation',
          createPerson: {
            ...person,
            __typename: "Person",
            id:  Math.round(Math.random() * -1000000)
          }
        },
        update(cache, { data: { createPerson } }){
          // read the data from the cache for this query
          const query = cache.readQuery({query: gql(listPersons)})
          // add our person from the mutation to the end
          query.listPersons.items.push(createPerson);
          // write the data back to the cache
          cache.writeQuery({
            query: gql(listPersons),
            data: query
          });
        }
      })
    },
  }
}
</script>

<style lang="css" scoped>
  .form {
    max-width: 400px;
  }
  .container {
    display: flex;
    justify-content: space-around;
  }
</style>