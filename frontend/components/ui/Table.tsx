import React, { useState, useMemo } from 'react';
import { TableColumn, SelectOption } from '../../types';
import { PAGINATION_DEFAULT_PAGE_SIZE, ICONS } from '../../constants';
import Button from './Button';

interface TableProps<T extends { id: string | number }> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  searchableKeys?: (keyof T | string)[];
  defaultPageSize?: number;
  // TODO: Add filter options later
}

const Table = <T extends { id: string | number }>(
  { columns, data, isLoading, onRowClick, searchableKeys, defaultPageSize = PAGINATION_DEFAULT_PAGE_SIZE }: TableProps<T>
) => {
  console.log('Table render: onRowClick está', typeof onRowClick);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | string; direction: 'asc' | 'desc' } | null>(null);

  const filteredData = useMemo(() => {
    let result = data;
    if (searchTerm && searchableKeys && searchableKeys.length > 0) {
      result = result.filter(item => 
        searchableKeys.some(key => {
          const value = item[key as keyof T];
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
    return result;
  }, [data, searchTerm, searchableKeys]);

  const sortedData = useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key as keyof T];
        const valB = b[sortConfig.key as keyof T];
        if (valA < valB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const requestSort = (key: keyof T | string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const pageSizeOptions: SelectOption[] = [
    { value: 5, label: '5 por páxina' },
    { value: 10, label: '10 por páxina' },
    { value: 20, label: '20 por páxina' },
    { value: 50, label: '50 por páxina' },
  ];

  return (
    <div className="bg-white dark:bg-dark-surface shadow-md rounded-lg overflow-hidden">
      {searchableKeys && searchableKeys.length > 0 && (
        <div className="p-4 border-b dark:border-neutral-medium">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 dark:border-neutral-medium rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-neutral-dark dark:text-white"
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-medium">
          <thead className="bg-gray-50 dark:bg-neutral-dark">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-medium dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort(col.key)}
                >
                  {col.header}
                  {sortConfig && sortConfig.key === col.key && (
                    <i className={`ml-1 fa-solid ${sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down'}`}></i>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-200 dark:divide-neutral-medium">
            {isLoading ? (
              <tr><td colSpan={columns.length} className="p-4 text-center"><i className={`${ICONS.loading} text-2xl text-primary`}></i></td></tr>
            ) : paginatedData.length === 0 ? (
                <tr><td colSpan={columns.length} className="p-4 text-center text-neutral-medium dark:text-gray-400">Non hai datos dispoñibles.</td></tr>
            ) : (
              paginatedData.map((item) => (
                <tr 
                  key={item.id} 
                  className={`${onRowClick ? 'cursor-pointer hover:bg-neutral-light dark:hover:bg-neutral-dark' : ''}`}
                  onClick={() => {
                    console.log('Fila clicada:', item);
                    onRowClick?.(item);
                  }}
                >
                  {columns.map((col) => (
                    <td key={`${item.id}-${String(col.key)}`} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark dark:text-neutral-light">
                      {col.render ? col.render(item) : String(item[col.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
       {!isLoading && sortedData.length > pageSize && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-neutral-medium sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} variant="outline" size="sm">Anterior</Button>
            <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} variant="outline" size="sm">Seguinte</Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-neutral-medium dark:text-gray-400">
                Amosando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a <span className="font-medium">{Math.min(currentPage * pageSize, sortedData.length)}</span> de{' '}
                <span className="font-medium">{sortedData.length}</span> resultados
              </p>
            </div>
            <div className="flex items-center space-x-2">
                <select 
                    value={pageSize} 
                    onChange={e => {setPageSize(Number(e.target.value)); setCurrentPage(1);}}
                    className="px-2 py-1 border border-gray-300 dark:border-neutral-medium rounded-md text-sm dark:bg-neutral-dark dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    {pageSizeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Paxinación">
                <Button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  variant="outline" size="sm"
                  className="rounded-l-md"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </Button>
                {/* Consider adding page numbers here for larger datasets */}
                <Button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  variant="outline" size="sm"
                  className="rounded-r-md"
                >
                 <i className="fa-solid fa-chevron-right"></i>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;