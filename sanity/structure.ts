import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Magazin Lorena Lash')
    .items([
      S.documentTypeListItem('category').title('Categorii'),
      
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !['post', 'category'].includes(item.getId()!),
      ),
    ])
