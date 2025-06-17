export const adaptUser = (data: any) => ({
  id: data._id,
  name: data.full_name,
  email: data.email_address,
  isActive: data.status === 'active',
});

