import {FaKey} from 'react-icons/fa'
import {defineType, defineField} from 'sanity'

export const accessCodeType = defineType({
  name: 'accessCode',
  title: 'Coduri de Acces',
  type: 'document',
  icon: FaKey,
  fields: [
    defineField({
      name: 'code',
      title: 'Cod Unic',
      type: 'string',
      validation: Rule => Rule.required().min(6).max(10),
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
      description: 'ID-ul utilizatorului care a utilizat codul',
      hidden: ({document}) => !document?.isUsed,
    }),
    defineField({
      name: 'isUsed',
      title: 'Cod Folosit',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'createdAt',
      title: 'Data Creării',
      type: 'datetime',
      initialValue: new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'code',
      subtitle: 'isUsed',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title,
        subtitle: subtitle ? 'Folosit ✅' : 'Neutilizat ❌',
      }
    },
  },
})
