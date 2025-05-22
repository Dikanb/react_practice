/* eslint-disable jsx-a11y/accessible-emoji */
import './App.scss';
import classNames from 'classnames';
import { useState } from 'react';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(cat => cat.id === product.categoryId) || null;
  const user = usersFromServer.find(us => us.id === category.ownerId) || null;

  return { ...product, category, user };
});
const USERS_LIST = ['Roma', 'Anna', 'Max', 'John'];
const CATEGORIES = ['Grocery', 'Drinks', 'Fruits', 'Electronics', 'Clothes'];
const HEADERS = ['ID', 'Product', 'Category', 'User'];
const productFilter = (list, filters) => {
  return list.filter(product => {
    const selector = filters.query
      ? product.name.toLowerCase().includes(filters.query.trim().toLowerCase())
      : true;

    const ourUser = filters.userFilter
      ? product.user.name === filters.userFilter
      : true;

    const ourCategory =
      filters.onCategori.length > 0
        ? filters.onCategori.includes(product.category.title)
        : true;

    return selector && ourUser && ourCategory;
  });
};

export const App = () => {
  const [userFilter, setUserFilter] = useState(null);
  const [onCategori, setonCategori] = useState([]);
  const [query, setQuery] = useState('');
  const productsFilter = productFilter(products, {
    userFilter,
    onCategori,
    query,
  });

  const resetFilters = () => {
    setUserFilter(null);
    setonCategori([]);
    setQuery('');
  };

  const changeCategory = category => {
    if (onCategori.includes(category)) {
      setonCategori(prev => prev.filter(c => c !== category));
    } else {
      setonCategori(prev => [...prev, category]);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <button
                type="button"
                className={classNames({ 'is-active': userFilter === null })}
                data-cy="FilterAllUsers"
                onClick={() => setUserFilter(null)}
              >
                All
              </button>
              {USERS_LIST.map(user => (
                <button
                  type="button"
                  key={user}
                  data-cy="FilterUser"
                  className={classNames({ 'is-active': userFilter === user })}
                  onClick={() => setUserFilter(user)}
                >
                  {user}
                </button>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value.trimStart())}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={resetFilters}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <button
                type="button"
                data-cy="AllCategories"
                className={classNames('button is-success mr-6', {
                  'is-outlined': onCategori.length !== 0,
                })}
                onClick={() => setonCategori([])}
              >
                All
              </button>
              {CATEGORIES.map(category => (
                <button
                  type="button"
                  key={category}
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': onCategori.includes(category),
                  })}
                  onClick={() => changeCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="panel-block">
              <button
                type="button"
                data-cy="ResetAllButton"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetFilters}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {productsFilter.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {HEADERS.map(table => (
                    <th key={table}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {table}
                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {productsFilter.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {product.category.icon} - {product.category.title}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={classNames(
                        product.user.sex === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger',
                      )}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
