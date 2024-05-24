import { _mock } from 'src/_mock';
import { useAuthContext } from 'src/auth/hooks';

// TO GET THE USER FROM THE AUTHCONTEXT, YOU CAN USE

// CHANGE:
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// const { user } = useMockedUser();

// TO:
// import { useAuthContext } from 'src/auth/hooks';
// const { user } = useAuthContext();

// ----------------------------------------------------------------------

export function useMockedUser() {
  const auth = useAuthContext();
  const user = {
    id: auth?.user?.id || '',
    displayName: auth?.user?.full_name || '' ,
    email: auth?.user?.email || '',
    birthdate: auth?.user?.birthdate || '',
    // password: 'demo1234',
    photoURL: auth?.user?.image || null,
    phoneNumber: auth?.user?.country_code + auth?.user?.mobile || '',
    country: auth?.user?.country || '',
    address: auth?.user?.address || '',
    state: auth?.user?.region,
    city: auth?.user?.city || '',
    zipCode: '',
    // about: 'Praesent turpis. Phasellus viverra nulla ut metus varius laoreet. Phasellus tempus.',
    role: auth?.user?.role.name,
    isPublic: true,
  };

  return { user };
}
