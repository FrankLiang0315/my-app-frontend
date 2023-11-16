"use client"
export default function AuthLayout(props: {
  title?: string;
  children?: React.ReactNode;
}) {
  const { title, children } = props;
  return (
    <div className="p-2 sm:p-5">
      <div className="card p-5 w-full max-w-[500px] m-auto text-center sm:p-10">
        <p className=" text-2xl font-bold m-0 mb-5">{title}</p>
        {children}
      </div>
    </div>
  );
}
