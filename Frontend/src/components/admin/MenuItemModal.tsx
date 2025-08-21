import { Modal, Portal, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";

export type FormValues = {
  name: string;
  price: number;
  image?: string;
  description: string;
};

type MenuItemModalProps = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: FormValues) => void;
  defaultValues?: FormValues;
  submitLabel?: string;
};

export default function MenuItemModal({
  visible,
  onDismiss,
  onSubmit,
  defaultValues,
  submitLabel = "Thêm món",
}: MenuItemModalProps) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    } else {
      reset({ name: "", price: 0, image: "", description: "" }); // create mode
    }
  }, [defaultValues, reset]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          padding: 20,
          backgroundColor: "#fff",
          margin: 20,
          borderRadius: 8,
        }}
      >
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextInput
              label="Tên món"
              mode="outlined"
              value={field.value}
              onChangeText={field.onChange}
              style={{ marginBottom: 12 }}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field }) => (
            <TextInput
              label="Giá"
              mode="outlined"
              value={field.value?.toString() ?? ""}
              onChangeText={(text) => {
                // Cho phép nhập số + dấu .
                const numericValue = text.replace(/[^0-9.]/g, "");
                field.onChange(numericValue);
              }}
              keyboardType="decimal-pad"
              style={{ marginBottom: 12 }}
            />
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
              multiline
              style={{ marginBottom: 12 }}
            />
          )}
        />

        {/* Image URL */}
        <Controller
          control={control}
          name="image"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Image URL"
              mode="outlined"
              value={value}
              onChangeText={onChange}
              style={{ marginBottom: 12 }}
            />
          )}
        />
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          {submitLabel}
        </Button>
      </Modal>
    </Portal>
  );
}
