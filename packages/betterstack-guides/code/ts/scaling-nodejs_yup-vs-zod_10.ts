# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 10

<Formik
  initialValues={{ firstName: '', lastName: '', email: '' }}
  validationSchema={validationSchema}
  onSubmit={values => console.log(values)}
>
  {/* Form fields */}
</Formik>