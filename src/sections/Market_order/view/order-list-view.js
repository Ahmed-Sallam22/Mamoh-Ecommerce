import { useState, useCallback, useEffect } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";
// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

// utils
import { fTimestamp } from "src/utils/format-time";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// components
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { ConfirmDialog } from "src/components/custom-dialog";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import {
  useTable,
  getComparator,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  TableSkeleton,
} from "src/components/table";
//
import OrderTableRow from "../order-table-row";
import OrderTableToolbar from "../order-table-toolbar";
import OrderTableFiltersResult from "../order-table-filters-result";

// api
import { useGetAllMarketOrders } from "src/api/delivery";
import { useGetStatics, useGetStatusorder } from "src/api/blog";
import i18n from "src/locales/i18n";
import { useLocales } from "src/locales";

// ----------------------------------------------------------------------





const defaultFilters = {
  name: "",
  status: "All requests",
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function OrderListView() {
  const {t}=useLocales()

  const TABLE_HEAD = [
    { id: "order_no", label: t("Order"), width: 116 },
    { id: "name", label: t("Customer") },
    { id: "order_date", label: t("Date"), width: 140 },
    { id: "qty", label: t("Items"), width: 120, align: "center" },
    { id: "total_price", label: t("Price"), width: 140 },
    { id: "status", label: t("Status"), width: 110 },
    { id: "", width: 88 },
  ];
  const table = useTable();
  const [filters, setFilters] = useState(defaultFilters);
  const [count, setCount] = useState(0)

  const settings = useSettingsContext();

  const router = useRouter();

  const [orderStatuss, setorderStatus] = useState([]);

const [dispalyids, setdispalyids] = useState();
const [setidOFAll, setsetidOFAll] = useState();
const [tableData, setTableData] = useState([]);
  const { allMarketOrders, meta,ordersLoading ,ordersEmpty} = useGetAllMarketOrders(setidOFAll,dispalyids,  table.page + 1,
    table.rowsPerPage);
    const { orderStatus } = useGetStatusorder(5);

    useEffect(() => {
      if(allMarketOrders?.length){
        setTableData(allMarketOrders);
        setCount(meta?.total);
        table.setPage(meta?.current_page - 1);
        table.setRowsPerPage(parseInt(meta?.per_page, 10));
      }
      if (orderStatus?.length) {
        setorderStatus(orderStatus)
      }
      if(orderStatus?.length>0){
        setsetidOFAll(orderStatus[0].display_status)
      }
      
    }, [allMarketOrders,orderStatus, meta?.cuurent_page, meta?.per_page, meta]);
  


  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });


  const dataInPage = dataFiltered

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name ||
    filters.status !== "All requests" ;


  const notFound = (!dataFiltered.length && canReset) || ordersEmpty;


  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      console.log(name, value);

      setFilters((prevState) => {
        return {
          ...prevState,
          [name]: value,
        };
      });
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter(
      (row) => !table.selected.includes(row.id)
    );
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewRow = useCallback((id) => {
    window.open(paths.dashboard.Foodorder.details(id), '_blank');
    return;
  }, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters("status", newValue);
    },
    [handleFilters]
  );
  const handeldisplaystatus = (status) => {
    const filteredStatus = orderStatuss?.filter((id) =>
    id.name==status
     );
    setdispalyids(filteredStatus[0]?.display_status)
  return filteredStatus ? filteredStatus.display_status : null;
  };
  const STATUS_OPTIONS = 
  (orderStatuss?.map((status) => {
  
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
  ;
  
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={t("Market Orders")}
          links={[
            {
              name: t("Dashboard"),
              href: paths.dashboard.root,
            },
            {
              name: t(" Market Order"),
              // href: paths.dashboard.Marketorder.root,
            },
            { name: t("List") },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS?.map((tab) => (
              <Tab
                iconPosition="end"
                key={tab.value}
                value={tab.value}
                label={tab.label}
                onClick={() => handeldisplaystatus(tab.value)}
                // icon={
                //   <Label
                //     variant={
                //       ((tab.value === "all" || tab.value === filters.status) &&
                //         "filled") ||
                //       "soft"
                //     }
                    
                //     color={
                //       tab.color
                //     }
                //   >
                //     {tab.count}
                //   </Label>
                // }
              />
            ))}
          </Tabs>

          <OrderTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            // canReset={canReset}
            // onResetFilters={handleResetFilters}
          />

          {canReset && (
            <OrderTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered?.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: "relative", overflow: "unset" }}>
            {/* <TableSelectedAction */}
              {/* dense={table.dense} */}
              {/* // numSelected={table.selected.length} */}
              {/* rowCount={tableData.length} */}
              {/* // onSelectAllRows={(checked) => */}
                {/* // table.onSelectAllRows( */}
                  {/* // checked, */}
                  {/* // tableData?.map((row) => row.id) */}
                {/* // ) */}
              {/* // } */}
              {/* // action={ */}
              {/* //   <Tooltip title="Delete"> */}
              {/* //     <IconButton color="primary" onClick={confirm.onTrue}> */}
              {/* //       <Iconify icon="solar:trash-bin-trash-bold" /> */}
              {/* //     </IconButton> */}
              {/* //   </Tooltip> */}
              {/* // } */}
            {/* /> */}

            <Scrollbar>
              <Table
                size={table.dense ? "small" : "medium"}
                sx={{ minWidth: 960 }}
              >
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
                  //     allMarketOrders?.map((row) => row.id)
                  //   )
                  // }
                />
                {ordersLoading ? (
                  [...Array(table.rowsPerPage)]?.map((i, index) => (
                    <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  ))
                ) : (
                  <TableBody>
                    {dataFiltered
                      ?.map((row) => (
                        <OrderTableRow
                          key={row.id}
                          row={row}
                          // selected={table.selected.includes(row.id)}
                          // onSelectRow={() => table.onSelectRow(row.id)}
                          // onDeleteRow={() => handleDeleteRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                        />
                      ))}
                    <TableNoData notFound={notFound} />
                  </TableBody>
                )}
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

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete{" "}
            <strong> {table.selected.length} </strong> items?
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
      /> */}
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;
  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis?.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (order) =>
        order.order_no.indexOf(name.toLowerCase()) !== -1 ||
        order?.user?.full_name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  // if (status !== "all") {
  //   inputData = inputData.filter(
  //     (order) => order.orders_status.owner_display_name === status
  //   );
  // }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (order) =>
          fTimestamp(order.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(order.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
