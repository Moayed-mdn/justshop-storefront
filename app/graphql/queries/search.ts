// app/graphql/queries/search.ts

import gql from 'graphql-tag'

export const SEARCH_QUERY = gql`
  query Search($query: String!, $locale: String!, $limit: Int) {
    search(query: $query, locale: $locale, limit: $limit) {
      total_count
      products {
        id
        name
        slug
        description
        price
        image_url
        avg_rating
        reviews_count
        category_name
        brand_name
        product_variant_id
        max_quantity
      }
      categories {
        id
        name
        slug
        products_count
      }
      brands {
        id
        name
        slug
        logo_url
        products_count
      }
    }
  }
`

export const AUTOCOMPLETE_QUERY = gql`
  query Autocomplete($query: String!, $locale: String!, $limit: Int) {
    autocomplete(query: $query, locale: $locale, limit: $limit) {
      id
      text
      type
      slug
      image_url
      price
      avg_rating
      reviews_count
    }
  }
`