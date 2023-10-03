"use client";

export type FormData = {
  email: string;
  password: string;
};

type FormPropsType = {
  title: string;
  buttonText: string;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  callback: React.FormEventHandler<HTMLFormElement>;
  error:
    | {
        message: string;
      }
    | undefined;
};

const Form = ({
  title,
  buttonText,
  formData,
  setFormData,
  callback,
  error,
}: FormPropsType) => (
  <section className="py-24 md:py-32 bg-white">
    <div className="container px-4 mx-auto">
      <div className="max-w-sm mx-auto">
        <div className="mb-6 text-center">
          <h3 className="mb-4 text-2xl md:text-3xl font-bold">{title}</h3>
          <form onSubmit={callback}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 px-3 text-coolGray-800 font-medium text-left"
              >
                Email
              </label>
              <input
                className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 px-3 text-coolGray-800 font-medium text-left"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="appearance-none block w-full p-3 leading-5 text-gray-900 border border-gray-200 rounded-lg shadow-md placeholder-text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            {error && (
              <div className="text-center my-4 text-red-600">
                Error: {error.message}
              </div>
            )}
            <button
              className="inline-block py-3 px-7 mb-6 w-full text-base text-green-50 font-medium text-center leading-6 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 rounded-md shadow-sm"
              type="submit"
            >
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default Form;
