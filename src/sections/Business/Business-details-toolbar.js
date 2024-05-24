import PropTypes from 'prop-types';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';
import { RouterLink } from 'src/routes/components';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useLocales } from 'src/locales';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function BusinessDetailsToolbar({
  publish,
  backLink,
  editLink,
  status,
  // liveLink,
  publishOptions,
  onChangePublish,
  sx,
  ...other
}) {
  const popover = usePopover();
  const {t}=useLocales()

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          {t("Back")}
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* {publish === 'published' && (
          <Tooltip title="Go Live">
            <IconButton component={RouterLink} href={liveLink}>
              <Iconify icon="eva:external-link-fill" />
            </IconButton>
          </Tooltip>
        )} */}
  <Stack spacing={0.5}>
            <Stack spacing={1} direction="row" alignItems="center">
            <Tooltip title={t("Edit")}>
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>
              <Label
                variant="soft"
                color={
                  (status === 'approved' && 'info') ||
    'default'
  }
              >
                {status}
              </Label>
            </Stack>
            </Stack>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {publishOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === publish}
            onClick={() => {
              popover.onClose();
              onChangePublish(option.value);
            }}
          >
            {option.value === 'published' && <Iconify icon="eva:cloud-upload-fill" />}
            {option.value === 'draft' && <Iconify icon="solar:file-text-bold" />}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

BusinessDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  editLink: PropTypes.string,
  liveLink: PropTypes.string,
  onChangePublish: PropTypes.func,
  publish: PropTypes.string,
  publishOptions: PropTypes.array,
  sx: PropTypes.object,
  status: PropTypes.string

};
