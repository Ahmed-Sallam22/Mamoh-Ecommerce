import isEqual from 'lodash/isEqual';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// _mock
import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
// api
import { useGetProducts, deleteProducts, updateProduct, useGetMarket_product } from 'src/api/product';
// components
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  // emptyRows,
  TableNoData,
  TableSkeleton,
  // TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import ProductTableRow from '../product-table-row';
import ProductTableToolbar from '../product-table-toolbar';
import ProductTableFiltersResult from '../product-table-filters-result';
import { enqueueSnackbar } from 'notistack';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------



const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const defaultFilters = {
  name: '',
  // publish: [],
  // stock: [],
};

// ----------------------------------------------------------------------

export default function ProductListView() {
  const {t}=useLocales()
  const TABLE_HEAD = [
    { id: 'name', label: t('Product') , maxWidth: 15},
    { id: 'status', label: t('Status'), width: 110 },
    // { id: 'qty', label: t('Quantity'), width: 140 },
    { id: 'Price From', label: t('Price From'), width: 140 },
    { id: 'Price To', label: t('Price To'), width: 140 },
    { id: 'no_of_orders', label: t('Orders'), width: 140 },
    { id: '', width: 88 },
  
  ];
  const router = useRouter();

  const table = useTable();

  const settings = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [count, setCount] = useState(1)

  const [failedDeleteIds, setFailedDeleteIds] = useState([]);
console.log(filters.name=="");
  const { Marketproducts, meta, MarketproductsLoading, MarketproductsEmpty } = useGetMarket_product(table.page + 1, table.rowsPerPage,filters.name);
   console.log(Marketproducts);

  const confirm = useBoolean();
  const errorDelete = useBoolean();


  useEffect(() => {
    if (Marketproducts.length) {
      setTableData(Marketproducts);
      setCount(meta?.total)
      table.setPage(meta?.current_page - 1);
      table.setRowsPerPage(parseInt(meta?.per_page, 10));
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Marketproducts, meta?.cuurent_page, meta?.per_page, meta]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered;

  const denseHeight = table.dense ? 60 : 80;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || MarketproductsEmpty;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteRow = useCallback( async (id) => {
      const { deletedIds,  failedIds} = await deleteProducts([id]);
   
      const deleteRows = tableData.filter((row) => !deletedIds.includes(row.id));
      setTableData(deleteRows);


      if(failedIds.length !== 0) {
        errorDelete.onTrue();
        setFailedDeleteIds(failedIds);
      }
      enqueueSnackbar(" Product Deleted successfully!");
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [errorDelete, dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback( async () => {
    if (table.selected.length === 0) return;

    const { deletedIds,  failedIds} = await deleteProducts(table.selected);
    const deleteRows = tableData.filter((row) => !deletedIds.includes(row.id));
    setTableData(deleteRows);

    if(failedIds.length !== 0) {
      errorDelete.onTrue();
      setFailedDeleteIds(failedIds);
    }
    enqueueSnackbar(" Products Deleted successfully!");
    
    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [errorDelete, dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.Market_product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.Market_product.details(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const increaseQuantityBy1 = useCallback(async (id, qty) => {
    const requestBody = {qty: qty + 1}
    const {success, data} = await updateProduct(id, requestBody);
    if(success){
      setTableData(prevTableData => {
        const index = prevTableData.findIndex(obj => obj.id === id);
        if(index !== -1){
          const updatedTableData = [...prevTableData];
          updatedTableData[index] = { ...updatedTableData[index], qty: data.qty };
          return updatedTableData;
        }else {
          return prevTableData
        } 
      });
    }
  }, []);
  const disincreaseQuantityBy1 = useCallback(async (id, qty) => {
    const newQty = Math.max(0, qty - 1);
    const requestBody = { qty: newQty };
    const { success, data } = await updateProduct(id, requestBody);
    if (success) {
      enqueueSnackbar("Product Quantity updated successfully!");
  
      setTableData(prevTableData => {
        const index = prevTableData.findIndex(obj => obj.id === id);
        if (index !== -1) {
          const updatedTableData = [...prevTableData];
          updatedTableData[index] = { ...updatedTableData[index], qty: data.qty };
          return updatedTableData;
        } else {
          return prevTableData;
        }
      });
    }
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t("Market Product")}
          links={[
            { name: t('Dashboard'), href: paths.dashboard.root },
            {
              name: t('Market Product'),
              // href: paths.dashboard.Market_product.root,
            },
            { name: t('List') },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.Market_product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              {t("New Market Product")}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <ProductTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            stockOptions={PRODUCT_STOCK_OPTIONS}
            publishOptions={PUBLISH_OPTIONS}
          />

          {canReset && (
            <ProductTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {MarketproductsLoading ? (
                    [...Array(table.rowsPerPage)]?.map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                   
                        .map((row) => (
                          <ProductTableRow
                            key={row.id}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            onDeleteRow={() => handleDeleteRow(row.id)}
                            onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            onUpdateQty={() => increaseQuantityBy1(row.id, row.qty)}
                            onUpdateQty2={() => disincreaseQuantityBy1(row.id, row.qty)}
                          />
                        ))}
                    </>
                  )}

               
                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={count}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
       <ConfirmDialog
        open={errorDelete.value}
        onClose={errorDelete.onFalse}
        title="Error Delete"
        content={
          <>
          {failedDeleteIds.map((errorItem) => (
            <Typography component='div' color='error' key={errorItem.productId}>{errorItem.message}</Typography>
          ))}
        </>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  // const { name, stock, publish } = filters;
   const { name } = filters;


  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (product) => product.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (stock.length) {
  //   inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  // }

  // if (publish.length) {
  //   inputData = inputData.filter((product) => publish.includes(product.publish));
  // }

  return inputData;
}
