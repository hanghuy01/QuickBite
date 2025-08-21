import { StyleSheet } from "react-native";
import { Modal, Portal, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { CategorySelectInput } from "../CategorySelectInput";
import { useEffect } from "react";

export type FormValuesRes = {
  name: string;
  address: string;
  description?: string;
  category: string;
  image?: string;
  lat: string;
  lon: string;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: FormValuesRes) => void;
  initialValues?: FormValuesRes; // nếu có → edit mode
};

export default function CreateOrEditRestaurantModal({ visible, onDismiss, onSubmit, initialValues }: Props) {
  const { control, handleSubmit, reset } = useForm<FormValuesRes>({
    defaultValues: initialValues || {
      name: "",
      address: "",
      description: "",
      category: "",
      image: "",
      lat: "",
      lon: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset({
        name: "",
        address: "",
        description: "",
        category: "",
        image: "",
        lat: "",
        lon: "",
      });
    }
  }, [initialValues, reset]);

  const isEditMode = !!initialValues;

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modal}>
        {/* Name */}
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Tên nhà hàng"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />

        {/* Category dropdown */}
        <CategorySelectInput control={control} name="category" />

        {/* Address */}
        <Controller
          control={control}
          name="address"
          render={({ field: { value, onChange } }) => (
            <TextInput label="Địa chỉ" mode="outlined" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

        {/* Description */}
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Mô tả"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={styles.input}
              multiline
            />
          )}
        />

        {/* Image URL */}
        <Controller
          control={control}
          name="image"
          render={({ field: { value, onChange } }) => (
            <TextInput label="Image URL" mode="outlined" value={value} onChangeText={onChange} style={styles.input} />
          )}
        />

        {/* Location */}
        <Controller
          control={control}
          name="lat"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Latitude"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              style={styles.input}
            />
          )}
        />
        <Controller
          control={control}
          name="lon"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Longitude"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              style={styles.input}
            />
          )}
        />

        {/* Submit */}
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          {isEditMode ? "Cập nhật" : "Tạo"}
        </Button>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: { backgroundColor: "#fff", padding: 20, margin: 20, borderRadius: 8 },
  input: { marginBottom: 12 },
});
