import { client } from "../client"; // Asigurați-vă că importați clientul Sanity corect configurat.

export const decrementProductStock = async (productId, quantity) => {
  if (!productId || !quantity || quantity <= 0) {
    throw new Error("ID-ul produsului și cantitatea trebuie să fie valide.");
  }

  try {
    // Verificăm dacă produsul există și are stoc disponibil
    const product = await client.fetch(
      `*[_type == "product" && _id == $productId][0]`,
      { productId }
    );

    if (!product) {
      throw new Error("Produsul nu a fost găsit.");
    }

    if (product.stock < quantity) {
      throw new Error("Stoc insuficient.");
    }

    // Actualizăm stocul
    await client.patch(productId).dec({ stock: quantity }).commit();

    return { success: true, message: "Stoc actualizat cu succes." };
  } catch (error) {
    console.error("Eroare la actualizarea stocului:", error);
    throw new Error("Nu s-a putut actualiza stocul.");
  }
};
