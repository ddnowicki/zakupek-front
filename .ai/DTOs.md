# ZakupekApi.Wrapper.Contract DTOs

This document lists all request and response DTOs in the `ZakupekApi.Wrapper.Contract` project, their types, properties and validation rules (excluding OpenRouter models).

---

## Auth.Request

### RegisterRequest (class)
- Email: string, required
- Password: string, required
- UserName: string, required
- HouseholdSize: int
- Ages: List<int>? optional
- DietaryPreferences: List<string>? optional

**Validation (RegisterRequestValidator):**
- Email: NotEmpty, EmailAddress
- Password: NotEmpty, MinimumLength(6), contains uppercase, number, special character
- UserName: NotEmpty
- HouseholdSize: GreaterThanOrEqualTo(1)
- Ages (when not null): all > 0, Count == HouseholdSize

### LoginRequest (class)
- Email: string, required
- Password: string, required

**Validation (LoginRequestValidator):**
- Email: NotEmpty, EmailAddress
- Password: NotEmpty

---

## Auth.Response

### AuthResponse (record)
- UserId: int
- UserName: string
- AccessToken: string
- ExpiresAt: DateTime

_No validation_

### UserProfileResponse (record)
- Id: int
- Email: string
- UserName: string
- HouseholdSize: int? optional
- Ages: List<int>? optional
- DietaryPreferences: List<string>? optional
- CreatedAt: DateTime
- ListsCount: int

_No validation_

---

## ShoppingLists.Request

### GetShoppingListsRequest (class)
- Page: int, default=1 [QueryParam]
- PageSize: int, default=10 [QueryParam]
- Sort: string, default="newest" [QueryParam]

_No validation_

### GetShoppingListByIdRequest (class)
- Id: int [BindFrom("id")]

_No validation_

### CreateShoppingListRequest (record)
- Title: string? optional
- Products: IEnumerable<ProductRequest>? optional
- PlannedShoppingDate: DateTime? optional
- StoreName: string? optional

**Validation (CreateShoppingListValidator):**
- Title: MaximumLength(100)
- Products: each ProductRequest validated

#### ProductRequest (record)
- Name: string
- Quantity: int

**Validation (ProductRequestValidator):**
- Name: NotEmpty, MaximumLength(100)
- Quantity: GreaterThan(0)

### UpdateShoppingListEndpointRequest (record)
- Id: int [BindFrom("id")]
- Body: UpdateShoppingListRequest [FromBody]

_No direct validation_

### UpdateShoppingListRequest (record)
- Title: string? optional
- Products: IEnumerable<UpdateProductRequest>? optional
- PlannedShoppingDate: DateTime? optional
- StoreName: string? optional

**Validation (UpdateShoppingListValidator):**
- Title: MaximumLength(100)
- Products: each UpdateProductRequest validated

#### UpdateProductRequest (record)
- Id: int? optional
- Name: string
- Quantity: int

**Validation (UpdateProductRequestValidator):**
- Name: NotEmpty, MaximumLength(100)
- Quantity: GreaterThan(0)

### DeleteShoppingListRequest (class)
- Id: int [BindFrom("id")]

_No validation_

### GenerateShoppingListRequest (record)
- Title: string? optional
- PlannedShoppingDate: DateTime? optional
- StoreName: string? optional

**Validation (GenerateShoppingListValidator):**
- Title: MaximumLength(100)

---

## ShoppingLists.Response

### PaginationMetadata (record)
- Page: int
- PageSize: int
- TotalItems: int
- TotalPages: int

_No validation_

### ShoppingListsResponse (record)
- Data: IEnumerable<ShoppingListResponse>
- Pagination: PaginationMetadata

_No validation_

### ShoppingListResponse (record)
- Id: int
- Title: string? optional
- ProductsCount: int
- CreatedAt: DateTime
- Source: string

_No validation_

### ProductInListResponse (record)
- Id: int
- Name: string
- Quantity: int
- StatusId: int
- Status: string
- CreatedAt: DateTime

_No validation_

### ShoppingListDetailResponse (record)
- Id: int
- Title: string? optional
- CreatedAt: DateTime
- UpdatedAt: DateTime
- Source: string
- Products: IEnumerable<ProductInListResponse>

_No validation_