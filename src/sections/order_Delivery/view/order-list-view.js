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
import { useGetAllFoodOrdersDelivery } from "src/api/delivery";
import { useGetStatics, useGetStatusorder } from "src/api/blog";
import i18n from "src/locales/i18n";
import { useLocales } from "src/locales";

// ----------------------------------------------------------------------





const defaultFilters = {
  name: "",
  status: "all",
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
  const table = useTable({ defaultOrderBy: "orderNumber" });

  const settings = useSettingsContext();

  const router = useRouter();

  const [orderStatuss, setorderStatus] = useState([]);
  console.log(orderStatuss);



  const { allFoodOrdersDelivery, ordersLoading } = useGetAllFoodOrdersDelivery();
  const [tableData, setTableData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);



  const dataFiltered = applyFilter({
    inputData: allFoodOrdersDelivery,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  
  

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset =
    !!filters.name ||
    filters.status !== "all" ;
    const { orderStatus } = useGetStatusorder();

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  useEffect(() => {
    if (orderStatus?.length) {
      setorderStatus(orderStatus)
      // setTableData(allFoodOrdersDelivery);
     
    }
    
  }, [allFoodOrdersDelivery,orderStatus]);


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
    router.push(paths.dashboard.orderDelivery.details(id));
    return;
  }, []);

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters("status", newValue);
    },
    [handleFilters]
  );
  const getInvoiceLength = (status) => {
    return allFoodOrdersDelivery.filter((item) => item?.orders_status?.delivery_display_name === status).length;
  };
  const filteredStatuses = orderStatuss.filter(
    status =>
      status?.translations[0]?.delivery_display_name !== null &&
      status?.translations[1]?.delivery_display_name !== null
  );
  
  const STATUS_OPTIONS = [
    { value: 'all', label: i18n.language === 'ar' ? 'الكل' : 'All', count: allFoodOrdersDelivery?.length },
    ...(filteredStatuses.map(status => {
      const label = i18n.language === 'ar' ? status?.translations[0]?.delivery_display_name : status?.translations[1]?.delivery_display_name;
      const color =
        status.id === 2
          ? 'warning'
          : status.id === 6
          ? 'error'
          : status.id === 5
          ? 'success'
          : status.id === 4
          ? 'secondary'
          : status.id === 3
          ? 'primary'
          : status.id === 1
          ? 'info'
          : 'default';
      const count = getInvoiceLength(status?.delivery_display_name);
  
      return {
        value: status?.delivery_display_name,
        label: label,
        color: color,
        count: count,
      };
    })) || [],
  ];
  
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={t("Orders Delivery")}
          links={[
            {
              name: t("Dashboard"),
              href: paths.dashboard.root,
            },
            {
              name: t("Orders Delivery"),
              // href: paths.dashboard.orderDelivery.root,
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
                icon={
                  <Label
                    variant={
                      ((tab.value === "all" || tab.value === filters.status) &&
                        "filled") ||
                      "soft"
                    }
                    
                    color={
                      tab.color
                    }
                  >
                    {tab.count}
                  </Label>
                }
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
                  //     allFoodOrdersDelivery?.map((row) => row.id)
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
  .slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  )
  .map((row) => (
    // Check if delivery_display_name is not null before rendering the row
    row?.orders_status?.delivery_display_name !== null && (
      <OrderTableRow
        key={row.id}
        row={row}
        // selected={table.selected.includes(row.id)}
        // onSelectRow={() => table.onSelectRow(row.id)}
        // onDeleteRow={() => handleDeleteRow(row.id)}
        onViewRow={() => handleViewRow(row.id)}
      />
    )
  ))}
                    <TableNoData notFound={notFound} />
                  </TableBody>
                )}
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
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
  if (status !== "all") {
    inputData = inputData.filter(
      (order) => order.orders_status.delivery_display_name === status
    );
  }

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
