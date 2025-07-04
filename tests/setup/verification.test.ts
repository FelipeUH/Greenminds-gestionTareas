import { mockUser } from "../utils/testHelpers";

describe("Configuración de Testing", () => {
  describe("Verificación del entorno", () => {
    it("debería tener configurado Jest correctamente", () => {
      expect(jest).toBeDefined();
      expect(describe).toBeDefined();
      expect(it).toBeDefined();
      expect(expect).toBeDefined();
    });

    it("debería tener mocks básicos disponibles", () => {
      expect(mockUser).toBeDefined();
      expect(mockUser.id).toBeTruthy();
      expect(mockUser.email).toBeTruthy();
    });

    it("debería poder ejecutar tests asincrónicos", async () => {
      const promise = Promise.resolve("test");
      const result = await promise;
      expect(result).toBe("test");
    });

    it("debería manejar errores correctamente", () => {
      expect(() => {
        throw new Error("Test error");
      }).toThrow("Test error");
    });
  });

  describe("Variables de entorno", () => {
    it("debería tener NODE_ENV configurado como test", () => {
      expect(process.env.NODE_ENV).toBe("test");
    });

    it("debería tener configuración de Supabase para tests", () => {
      expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
      expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    });
  });

  describe("Utilidades de testing", () => {
    it("debería poder crear mocks de objetos", () => {
      const mockFn = jest.fn();
      mockFn("test");

      expect(mockFn).toHaveBeenCalled();
      expect(mockFn).toHaveBeenCalledWith("test");
    });

    it("debería poder usar matchers de Jest", () => {
      const obj = { name: "test", count: 5 };

      expect(obj).toMatchObject({ name: "test" });
      expect(obj.count).toBeGreaterThan(0);
      expect(obj.name).toContain("tes");
    });

    it("debería manejar arrays correctamente", () => {
      const arr = [1, 2, 3, 4, 5];

      expect(arr).toHaveLength(5);
      expect(arr).toContain(3);
      expect(arr).toEqual(expect.arrayContaining([1, 5]));
    });
  });
});
