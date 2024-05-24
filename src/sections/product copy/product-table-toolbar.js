import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
// import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
// import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
// import FormControl from '@mui/material/FormControl';
// import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
// import Select from '@mui/material/Select';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { t } from 'i18next';
import { useLocales } from 'src/locales';

// ----------------------------------------------------------------------

export default function ProductTableToolbar({
  filters,
  onFilters,
  //
  // stockOptions,
  // publishOptions,
}) {
  const popover = usePopover();
const {t}=useLocales()
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  // const handleFilterStock = useCallback(
  //   (event) => {
  //     onFilters(
  //       'stock',
  //       typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
  //     );
  //   },
  //   [onFilters]
  // );

  // const handleFilterPublish = useCallback(
  //   (event) => {
  //     onFilters(
  //       'publish',
  //       typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value
  //     );
  //   },
  //   [onFilters]
  // );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.6,
          pr: { xs: 2.5, md: 1 },
        }}
      >
       

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1, justifyContent: 'flex-end' }}>
          <TextField
            value={filters.name}
            onChange={handleFilterName}
            placeholder={t("Search...")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

        
        </Stack>
      </Stack>

   
    </>
  );
}

ProductTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  publishOptions: PropTypes.array,
  stockOptions: PropTypes.array,
};
