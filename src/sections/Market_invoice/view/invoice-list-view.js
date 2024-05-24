import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fTimestamp } from 'src/utils/format-time';
// _mock
import { _invoices, INVOICE_SERVICE_OPTIONS } from 'src/_mock';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from 'src/components/table';
//
import InvoiceAnalytic from '../invoice-analytic';
import InvoiceTableRow from '../invoice-table-row';
import InvoiceTableToolbar from '../invoice-table-toolbar';
import InvoiceTableFiltersResult from '../invoice-table-filters-result';
import { useGetReports, useGetStatics, useGetStatusorder } from 'src/api/blog';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useAuthContext } from 'src/auth/hooks';
import axios from 'axios';
import i18n from 'src/locales/i18n';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------



const defaultFilters = {
  name: '',
  service: [],
  status: "All requests",
};

// ----------------------------------------------------------------------

export default function InvoiceListView() {
  const {t}=useLocales()
  const TABLE_HEAD = [
    { id: 'invoiceNumber', label: t('Customer') },
    { id: 'order_date', label: t('Order Date') },
    { id: 'price', label: t('Price') },
    // { id: 'status', label: t('User Status') },
    { id: 'status', label: t('Owner Status') },
    { id: '' },
  ];
  const theme = useTheme();

  const settings = useSettingsContext();

  const router = useRouter();
  const [tableData, setTableData] = useState([]);

  const table = useTable();
  const [filters, setFilters] = useState(defaultFilters);
  const [count, setCount] = useState(0)
  const [orderStatuss, setorderStatus] = useState([]);
  const [orderStatics, setorderStatcs] = useState([]);
  const [dispalyids, setdispalyids] = useState();
  const [setidOFAll, setsetidOFAll] = useState();
  const { reports, meta, reportsLoading, reportsEmpty } = useGetReports(setidOFAll,dispalyids,5,  table.page + 1,
    table.rowsPerPage);
  const { orderStatus } = useGetStatusorder(5);
  const { orderStatic } = useGetStatics(5);
  const confirm = useBoolean();
  useEffect(() => {
    if (reports?.length) {
      setorderStatcs(orderStatic)
      setorderStatus(orderStatus)
      setCount(meta?.total);
      setTableData(reports)
      table.setPage(meta?.current_page - 1);
      table.setRowsPerPage(parseInt(meta?.per_page, 10));
    }
    if(orderStatus?.length>0){
      setsetidOFAll(orderStatus[0].display_status)
      setorderStatus(orderStatus)
      setorderStatcs(orderStatic)
    }
    
  }, [reports,orderStatus, meta?.cuurent_page, meta?.per_page, meta]);


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const dataInPage = dataFiltered

  const denseHeight = table.dense ? 60 : 80;

  const canReset =
    !!filters?.name ||
    filters.status !== "All requests" ;

  const notFound = (!dataFiltered.length && canReset) ||reportsEmpty ;


  const handeldisplaystatus = (status) => {
    console.log(status);

    const filteredStatus = orderStatuss?.filter((id) =>
    id.name==status
     );
    setdispalyids(filteredStatus[0]?.display_status)
  return filteredStatus ? filteredStatus.display_status : null;
  };



  const TABS =  (orderStatuss?.map((status) => {
  
    const label =status.name;
    const color =
      status.id === 24
        ? 'warning'
        : status.id === 38
        ? 'error'
        : status.id ===32
        ? 'success'
        : status.id === 36
        ? 'secondary'
        : status.id === 29
        ? 'primary'
        : status.id === 27
        ? 'info'
        : 'default';
    // const count = getInvoiceLength(status?.name);

    return {
      value: status?.name,
      label: label,
      color: color,
      // count: count,
    };
  })) 
    
 

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

 



  const handleViewRow = useCallback(
    (id) => {
        router.push(paths.dashboard.Marketinvoice.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading={t("Market Invoices")}
          links={[
            {
              name: t('Dashboard'),
              href: paths.dashboard.root,
            },
            {
              name: t('Market Invoice'),
              // href: paths.dashboard.Marketinvoice.root,
            },
            {
              name: t('List'),
            },
          ]}
         
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
             {orderStatics?.map((status, index) => (
  <InvoiceAnalytic
    key={index}
    title={status?.name}
    total={tableData.length}
    percent={status?.percent}
    price={status?.total_price}
    icon={status?.status_id===1? 'solar:sort-by-time-bold-duotone': status?.status_id===2 ? 'solar:file-check-bold-duotone':  status?.status_id===3 ? 'solar:file-check-bold-duotone' : status?.status_id===4 ? 'solar:bill-list-bold-duotone' :  status?.status_id===5 ? 'fluent:call-end-28-filled' :  status?.status_id===6 ? 'solar:file-corrupted-bold-duotone' : 'solar:file-corrupted-bold-duotone'}
    color={status?.status_id===1? theme.palette.info.main : status?.status_id===2 ? theme.palette.success.main:  status?.status_id===3 ? theme.palette.warning.main : status?.status_id===4 ? theme.palette.secondary.main :  status?.status_id===5 ? theme.palette.primary.main :  status?.status_id===6 ? theme.palette.error.main : theme.palette.text.secondary}
  />
))}
   
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {TABS?.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
                onClick={() => handeldisplaystatus(tab.value)}

                // icon={
                //   <Label
                //     variant={
                //       ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                //     }
                //     color={tab.color}
                //   >
                //     {tab.count}
                //   </Label>
                // }
              />
            ))}
          </Tabs>

          <InvoiceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            serviceOptions={INVOICE_SERVICE_OPTIONS.map((option) => option?.name)}
          />
          {canReset && (
            <InvoiceTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
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
                <Stack direction="row">
              {/* //     <Tooltip title="Sent">
              //       <IconButton color="primary">
              //         <Iconify icon="iconamoon:send-fill" />
              //       </IconButton>
              //     </Tooltip> */}

                  <Tooltip title="Download">
                    <IconButton color="primary">
                      <Iconify icon="eva:download-outline" />
                    </IconButton>
                  </Tooltip>

                   <Tooltip title="Print">
                     <IconButton color="primary">
                       <Iconify icon="solar:printer-minimalistic-bold" />
                     </IconButton>
                   </Tooltip>
{/* 
              //     <Tooltip title="Delete">
              //       <IconButton color="primary" onClick={confirm.onTrue}>
              //         <Iconify icon="solar:trash-bin-trash-bold" />
              //       </IconButton>
              //     </Tooltip> */}
                </Stack>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  // numSelected={table.selected.length}
                  onSort={table.onSort}
                  // onSelectAllRows={(checked) =>
                  //   table.onSelectAllRows(
                  //     checked,
                  //     tableData.map((row) => row.id)
                  //   )
                  // }
                />

<TableBody>
                  {reportsLoading ? (
                    [...Array(table.rowsPerPage)]?.map((i, index) => (
                      <TableSkeleton key={index} sx={{ height: denseHeight }} />
                    ))
                  ) : (
                    <>
                      {dataFiltered
                       ?.map((row) => (
                          <InvoiceTableRow
                            key={row.id}
                            row={row}
                            // selected={table.selected.includes(row.id)}
                            // onSelectRow={() => table.onSelectRow(row.id)}
                            // onDeleteRow={() => handleDeleteRow(row.id)}
                            // onEditRow={() => handleEditRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}

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
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

    
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice?.order_no?.indexOf(name.toLowerCase()) !== -1 ||
        invoice?.user?.full_name?.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  // if (status !== 'all') {
  //   inputData = inputData.filter((invoice) => invoice?.orders_status?.owner_display_name === status);
  // }

 

 
  return inputData;
}
