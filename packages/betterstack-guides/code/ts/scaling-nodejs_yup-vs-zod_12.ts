# Source: https://betterstack.com/community/guides/scaling-nodejs/yup-vs-zod/
# Original language: typescript
# Normalized: ts
# Block index: 12

const { register, handleSubmit, errors } = useForm({
  resolver: zodResolver(formSchema)
});