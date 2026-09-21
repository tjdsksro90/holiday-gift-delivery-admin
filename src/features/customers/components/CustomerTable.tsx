import {
  Chip,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { RevealContactButton } from '@/components/common/RevealContactButton'
import { RoleGuard } from '@/components/common/RoleGuard'
import type { Customer } from '@/types/customer'

interface CustomerTableProps {
  customers: Customer[]
}

export function CustomerTable({ customers }: CustomerTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>이름</TableCell>
            <TableCell>연락처</TableCell>
            <TableCell>주소</TableCell>
            <TableCell>등급</TableCell>
            <TableCell align="right">열람</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} hover>
              <TableCell>
                <MuiLink component={RouterLink} to={`/customers/${customer.id}`}>
                  {customer.name}
                </MuiLink>
              </TableCell>
              <TableCell>{customer.phoneMasked}</TableCell>
              <TableCell>{customer.addressMasked}</TableCell>
              <TableCell>
                <Chip size="small" label={customer.membershipTier} />
              </TableCell>
              <TableCell align="right">
                <RoleGuard allow={['ADMIN', 'CS_AGENT']}>
                  <RevealContactButton customerId={customer.id} />
                </RoleGuard>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
