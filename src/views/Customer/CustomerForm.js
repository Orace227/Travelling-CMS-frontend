import React from 'react'

export default function CustomerForm() {
  return (
    <>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ values }) => (
          <Form>
            <Grid container spacing={2}>
          
            <Grid item xs={12} sm={6}>
              <Field name="firstName" as={TextField} label="First Name" fullWidth margin="normal" variant="outlined" />
              <ErrorMessage name="firstName" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="lastName" as={TextField} label="Last Name" fullWidth margin="normal" variant="outlined" />
              <ErrorMessage name="lastName" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field name="email" as={TextField} label="Email" fullWidth margin="normal" variant="outlined" />
              <ErrorMessage name="email" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                name="mobile"
                as={TextField}
                label="Mobile"
                type="text"
                fullWidth
                margin="normal"
                variant="outlined"
                inputProps={{
                  inputMode: 'numeric',
                  maxLength: 10 // Add maximum length attribute
                }}
                onKeyPress={handleMobileKeyPress}
              />
              <ErrorMessage name="mobile" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                name="dateOfBirth"
                as={TextField}
                label="Date of Birth"
                type="date"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <ErrorMessage name="dateOfBirth" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                name="passportNumber"
                as={TextField}
                label="Passport Number"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <ErrorMessage name="passportNumber" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Field
                name="passportExpiryDate"
                as={TextField}
                label="Passport Expiry Date"
                type="date"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <ErrorMessage name="passportExpiryDate" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Frequent Flyer Numbers
              </Typography>
              <FieldArray name="frequentFlyerNumbers">
                {({ push, remove }) => (
                  <div>
                    {values.frequentFlyerNumbers.map((ffNumber, index) => (
                      <div key={index}>
                        <Field
                          name={`frequentFlyerNumbers[${index}].type`}
                          as={TextField}
                          label="Frequent Flyer Type"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`frequentFlyerNumbers[${index}].type`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                        <Field
                          name={`frequentFlyerNumbers[${index}].number`}
                          as={TextField}
                          label="Frequent Flyer Number"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`frequentFlyerNumbers[${index}].number`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => remove(index)}
                        >
                          Remove Frequent Flyer
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outlined"
                      style={{marginTop:"10px"}}
                      onClick={() => push({ type: '', number: '' })}
                    >
                      Add Frequent Flyer
                    </Button>
                  </div>
                )}
              </FieldArray>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Hotel Loyalty Numbers
              </Typography>
              <FieldArray name="hotelLoyaltyNumbers">
                {({ push, remove }) => (
                  <div>
                    {values.hotelLoyaltyNumbers.map((hlNumber, index) => (
                      <div key={index}>
                        <Field
                          name={`hotelLoyaltyNumbers[${index}].type`}
                          as={TextField}
                          label="Hotel Loyalty Type"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`hotelLoyaltyNumbers[${index}].type`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                        <Field
                          name={`hotelLoyaltyNumbers[${index}].number`}
                          as={TextField}
                          label="Hotel Loyalty Number"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                        />
                        <ErrorMessage
                          name={`hotelLoyaltyNumbers[${index}].number`}
                          component="div"
                          className="error"
                          style={{ color: 'red' }}
                        />
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          onClick={() => remove(index)}
                        >
                          Remove Hotel Loyalty
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outlined"
                      style={{marginTop:"10px"}}

                      onClick={() => push({ type: '', number: '' })}
                    >
                      Add Hotel Loyalty
                    </Button>
                  </div>
                )}
              </FieldArray>
            </Grid>
            <Grid item xs={12}>
              <Field name="address" as={TextField} label="Address" fullWidth margin="normal" variant="outlined" />
              <ErrorMessage name="address" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12}>
              <Field name="city" as={TextField} label="City" fullWidth margin="normal" variant="outlined" />
              <ErrorMessage name="city" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12}>
              <Field name="country" as={TextField} label="Country" fullWidth margin="normal" variant="outlined" />
              <ErrorMessage name="country" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12}>
              <Field name="postalCode" as={TextField} label="Postal Code" fullWidth margin="normal" variant="outlined" />
              <ErrorMessage name="postalCode" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
            <Grid item xs={12}>
              <Field name="foodPreferences" as={TextField} label="Food Preferences" fullWidth margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Field name="companyName" as={TextField} label="Company Name" fullWidth margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Field name="companyGSTNumber" as={TextField} label="Company GST Number" fullWidth margin="normal" variant="outlined" />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="companyGSTEmail"
                as={TextField}
                label="Company GST Email"
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <ErrorMessage name="companyGSTEmail" component="div" className="error" style={{ color: 'red' }} />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" color="primary" size="large" style={{ marginTop: '1rem' }}>
            Submit
          </Button>
        </Form>
        )}
      </Formik> 
    </>
  )
}
