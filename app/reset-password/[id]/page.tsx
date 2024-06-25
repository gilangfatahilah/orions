import { ResetPassword } from '@/components/forms/reset-password';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';

const ResetPasswordPage = async ({ params }: { params: { id: string } }) => {
  const userExists = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!userExists) {
    redirect('/not-found');
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <ResetPassword id={params.id} />
    </div>
  )
};

export default ResetPasswordPage;
