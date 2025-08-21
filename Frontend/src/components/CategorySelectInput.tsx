import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Dialog, List, Portal, TextInput } from "react-native-paper";
import { Controller } from "react-hook-form";

const CATEGORIES = ["Pizza", "Sushi", "Drinks"];

export function CategorySelectInput({ control, name }: { control: any; name: string }) {
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <Controller
      control={control}
      name="category"
      render={({ field: { value, onChange } }) => (
        <>
          <TextInput
            label="Category"
            mode="outlined"
            value={value}
            style={styles.input}
            editable={false}
            right={<TextInput.Icon icon="menu-down" onPress={() => setDialogVisible(true)} />}
          />
          <Portal>
            <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
              <Dialog.Title>Chọn Category</Dialog.Title>
              <Dialog.Content>
                {CATEGORIES.map((c) => (
                  <List.Item
                    key={c}
                    title={c}
                    onPress={() => {
                      onChange(c);
                      setDialogVisible(false);
                    }}
                  />
                ))}
              </Dialog.Content>
            </Dialog>
          </Portal>
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
});
