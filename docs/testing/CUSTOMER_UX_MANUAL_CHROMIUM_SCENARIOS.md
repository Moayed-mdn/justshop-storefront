# Customer UX Manual Chromium Scenarios

## Purpose

Use this checklist to manually verify the complete customer UX in JustShop frontend using Chromium.

Environment:

- Frontend: `http://demo.justshop.test:3000` (or your configured port)
- Backend: `http://localhost:8000`

Recommended browser:

- Chromium
- DevTools open for console and network inspection

Suggested verification order:

1. P0 navigation and storefront loading
2. P0 product browsing and search
3. P1 cart management and checkout flow
4. P1 authentication and account creation
5. P2 order management and tracking
6. P2 profile management and settings

---

## Preconditions

Before testing:

- frontend is running on `http://demo.justshop.test:3000`
- backend is running on `http://localhost:8000`
- test accounts are available for:
  - customer with order history
  - customer with no orders
  - new customer (for registration testing)
- test data includes:
  - active products with stock
  - products with variants (size, color, etc.)
  - products in multiple categories
  - hero banners and promotional content
- payment testing configured:
  - Stripe test mode enabled
  - test card: `4242 4242 4242 4242`

If local seeded accounts are unknown, use the same accounts already used by your backend seed data.

---

## Scenario 1: Landing Page First Impression

### Goal

Verify customers land on a functional, attractive home page.

### Steps

1. Open Chromium.
2. Go to `http://demo.justshop.test:3000`.
3. Observe the initial page load.

### Expected

- page loads without errors
- store branding (logo, colors, fonts) is visible
- hero banners display correctly
- featured/best seller products are visible
- navigation menu is accessible
- language switcher works (if multi-language enabled)
- footer displays properly
- no console errors
- page is responsive and styled correctly

### Watch For

- blank page or loading state that hangs
- missing images or broken layout
- console errors or failed API calls
- incorrect theme colors or fonts
- missing navigation elements

---

## Scenario 2: Navigation Between Main Sections

### Goal

Verify primary navigation works smoothly across the storefront.

### Steps

1. From the home page, navigate to:
   - Shop/Products page
   - Individual product detail page
   - Cart page
   - Login page
2. Use browser back/forward buttons.
3. Click logo to return home.

### Expected

- all navigation links work correctly
- URLs update appropriately with locale prefix (`/en/` or `/ar/`)
- page transitions are smooth
- browser history works naturally
- logo always returns to home page
- mobile menu works on small screens

### Watch For

- broken navigation links
- incorrect URL routing
- missing locale prefixes
- navigation disappearing unexpectedly
- mobile menu not opening/closing

---

## Scenario 3: Product Catalog Browsing

### Goal

Verify customers can browse the product catalog effectively.

### Steps

1. Navigate to Shop/Products page.
2. Observe product grid layout.
3. Test pagination if available.
4. Try filtering by:
   - Category
   - Price range
   - Date range
5. Sort products if sorting is available.

### Expected

- products display in a clean grid layout
- product cards show image, name, price
- pagination works correctly
- filters update results immediately
- category navigation is intuitive
- "no results" state is clear when filters return nothing
- responsive layout on mobile devices

### Watch For

- broken product images
- missing product information
- filters not working
- pagination errors
- layout breaking on mobile
- slow or hanging filter operations

---

## Scenario 4: Product Search Functionality

### Goal

Verify product search delivers relevant results quickly.

### Steps

1. Click on the search bar in the header.
2. Type a product name or keyword.
3. Observe search results dropdown (if instant search).
4. Press Enter or click search button.
5. Review search results page.
6. Try searching for:
   - Existing product name
   - Category name
   - Brand name
   - Non-existent term

### Expected

- search input is easily accessible
- instant search shows results as you type (if implemented)
- search results include products, categories, brands
- full search results page displays comprehensive results
- "no results" message is helpful and actionable
- search is fast and responsive
- results are relevant to query

### Watch For

- search not working
- no instant feedback
- irrelevant results
- broken search results page
- missing "no results" state
- search too slow

---

## Scenario 5: Product Detail Page Experience

### Goal

Verify product detail pages provide complete product information.

### Steps

1. Click on a product from the catalog.
2. Observe product detail page layout.
3. Test:
   - Image gallery (zoom, thumbnails)
   - Variant selection (size, color, etc.)
   - Quantity selector
   - Add to cart button
   - Related products section
4. Try selecting different variants.
5. Adjust quantity.

### Expected

- product images load correctly in gallery
- image zoom/gallery navigation works
- variant selection updates display and price
- out-of-stock variants are disabled/indicated
- quantity selector enforces min/max limits
- "Add to Cart" button is prominent and functional
- product description, specs, and details are readable
- related products display correctly
- breadcrumbs show navigation path
- page is mobile-responsive

### Watch For

- missing or broken images
- variant selection not working
- quantity controls not validating
- add to cart button unresponsive
- missing product information
- layout issues on mobile
- console errors

---

## Scenario 6: Guest Cart Management

### Goal

Verify guest users can manage their shopping cart.

### Steps

1. As a guest (not logged in), add products to cart.
2. Add products with different variants.
3. Adjust quantities in the cart.
4. Remove individual items.
5. Navigate away and return to cart.
6. Refresh the page.

### Expected

- products add to cart successfully
- cart icon shows item count
- cart persists in localStorage
- cart survives page refresh
- quantity updates work smoothly
- item removal works with confirmation if needed
- cart total calculates correctly
- empty cart state is clear and actionable
- cart is isolated per tenant (if multi-tenant)

### Watch For

- cart not persisting
- incorrect item counts
- quantity updates failing
- cart total calculation errors
- items disappearing unexpectedly
- cart mixing between tenants (if multi-tenant)

---

## Scenario 7: Cart Summary and Checkout Button

### Goal

Verify cart summary displays correct information and checkout is accessible.

### Steps

1. Add multiple products to cart.
2. Navigate to cart page.
3. Review cart summary.
4. Test "Clear Cart" button if available.
5. Click "Proceed to Checkout" button.

### Expected

- subtotal calculates correctly
- item count is accurate
- checkout button is prominent
- clear cart requires confirmation
- checkout button redirects appropriately
- mobile sticky checkout bar works (if implemented)
- cart empty state shows after clearing

### Watch For

- incorrect calculations
- checkout button not working
- missing confirmation on clear cart
- layout issues on mobile
- checkout redirecting incorrectly

---

## Scenario 8: Guest Checkout Flow

### Goal

Verify guest users can complete checkout without account.

### Steps

1. As a guest with items in cart, proceed to checkout.
2. Observe checkout page or Stripe redirect.
3. Fill in required information (if not using Stripe hosted).
4. Use test card: `4242 4242 4242 4242`
5. Complete payment.
6. Observe confirmation page.

### Expected

- checkout process is clear and guided
- guest email field is available
- Stripe hosted checkout loads correctly
- test payment processes successfully
- order confirmation page shows order number
- order details are accurate
- "create account" prompt appears (if implemented)
- cart clears after successful checkout

### Watch For

- checkout page not loading
- Stripe redirect failing
- payment errors with test card
- missing order confirmation
- cart not clearing after order
- broken confirmation page

---

## Scenario 9: Customer Registration Flow

### Goal

Verify new customers can create accounts successfully.

### Steps

1. Navigate to Register page.
2. Fill in registration form:
   - Name
   - Email
   - Password
   - Confirm password
3. Submit registration.
4. Check for email verification prompt.
5. Verify email using verification link (if implemented).

### Expected

- registration form is clear and accessible
- real-time validation on form fields
- password requirements are communicated
- password confirmation validates match
- successful registration shows next steps
- email verification message is clear
- verification link works correctly
- account activates after verification

### Watch For

- form validation not working
- weak password accepted
- unclear error messages
- registration failing silently
- verification email not sent
- broken verification link
- account not activating

---

## Scenario 10: Customer Login and Session

### Goal

Verify customers can log in and maintain session.

### Steps

1. Navigate to Login page.
2. Log in with email and password.
3. Observe redirect after login.
4. Check that:
   - Profile dropdown appears in header
   - Guest cart merges with user cart (if had items)
   - User remains logged in after refresh
5. Navigate to protected pages (orders, profile).
6. Log out.

### Expected

- login form is clear and functional
- successful login redirects to intended page or home
- guest cart automatically merges with user cart
- session persists across page refreshes
- protected routes are accessible when logged in
- logout works correctly and clears session
- logout redirects to home or login page

### Watch For

- login failing with correct credentials
- guest cart not merging
- session not persisting
- protected routes accessible when logged out
- logout not clearing session
- redirect loops after login/logout

---

## Scenario 11: Google OAuth Login

### Goal

Verify social login integration works smoothly.

### Steps

1. Navigate to Login page.
2. Click "Sign in with Google" button.
3. Complete Google authentication flow.
4. Observe redirect back to app.
5. Check user session is established.

### Expected

- Google OAuth button is visible and styled
- OAuth flow opens in popup or redirect
- authentication completes successfully
- user is logged in after OAuth
- account is created if first-time Google user
- session persists like regular login
- Google-linked account badge shows in profile

### Watch For

- OAuth button not working
- OAuth popup blocked
- authentication failing
- redirect not returning to app
- account not created for new users
- session not persisting

---

## Scenario 12: Authenticated Shopping Flow

### Goal

Verify logged-in users have enhanced shopping experience.

### Steps

1. Log in as existing customer.
2. Browse and add products to cart.
3. View cart and verify items sync.
4. Navigate away and return.
5. Check cart persists across sessions.

### Expected

- cart saves to database instead of localStorage
- cart syncs across devices/browsers (if same account)
- cart persists even after logging out and back in
- checkout has pre-filled customer information
- shopping experience is seamless

### Watch For

- cart not syncing to server
- cart items lost on logout
- checkout missing customer info
- slower cart operations (performance)

---

## Scenario 13: Auth Page Template Rendering

### Goal

Verify auth pages (login, register, forgot-password) render with template-based header and footer sections instead of hardcoded minimal shell.

### Steps

1. Navigate to Login page (`/login`).
2. Observe the page header: should show centered logo with no search bar.
3. Observe the top navigation bar: should display runtime navigation items from the store's `main-menu` (if items exist).
4. Observe the footer: should display runtime footer items from the `footer-menu` (if items exist), not the hardcoded `FooterAuth`.
5. Navigate to Register page (`/register`) and repeat observation steps 2-4.
6. Navigate to Forgot Password page (`/forgot-password`) and repeat steps 2-4.
7. Verify language switching (EN ↔ AR) works on auth pages and navigation reflects correct locale.

### Expected

- auth pages show header with centered logo, no search bar, no burger menu
- top navigation bar shows store's main navigation items when they exist in the `main-menu`
- footer shows store's footer navigation items when they exist in the `footer-menu`
- auth form content (login, register, forgot-password) renders correctly in the center of the page
- auth pages function normally (can submit forms, see errors, etc.)
- language switching preserves auth state and renders translated navigation

### Watch For

- auth pages showing search bar or burger menu (should be hidden for auth template)
- auth pages showing empty header/footer when menus have items
- auth form rendering broken or overlapping with template sections
- runtime API errors preventing auth page from rendering template sections
- race condition where shellVariant stays `'minimal'` and shows `FooterAuth` instead of template footer
- session or auth state lost after language switch from auth page

---

## Scenario 14: Order History and Management

### Goal

Verify customers can view and manage their orders.

### Steps

1. Log in as customer with order history.
2. Navigate to "My Orders" page.
3. Test order filters:
   - Status filter (all, pending, shipped, delivered, cancelled)
   - Date range filter
4. Test pagination if available.
5. Click on an order to view details.

### Expected

- orders display in reverse chronological order
- each order card shows key info (number, status, date, total)
- filters update results correctly
- pagination works smoothly
- status badges are clear and color-coded
- "no orders" state is friendly and actionable
- order detail link works correctly

### Watch For

- orders not loading
- filters not working
- incorrect order information
- broken pagination
- missing status indicators
- broken order detail links

---

## Scenario 15: Order Detail Page

### Goal

Verify order details provide comprehensive information.

### Steps

1. Navigate to order detail page.
2. Review displayed information:
   - Order number and status
   - Order items with images, variants, quantities
   - Pricing breakdown (subtotal, shipping, tax, total)
   - Shipping address
   - Payment status
   - Tracking information (if shipped)
3. Test available actions (cancel, reorder, track).

### Expected

- all order information is accurate and readable
- order items display with correct details
- pricing matches order total
- shipping address is formatted correctly
- tracking number is visible if shipped
- "Cancel Order" button appears if order is cancellable
- "Reorder" button works correctly
- order status progression is clear

### Watch For

- missing order information
- incorrect pricing calculations
- shipping address formatting issues
- tracking info not showing
- cancel/reorder buttons not working
- confusing status display

---

## Scenario 16: Guest Order Tracking

### Goal

Verify guests can track orders without logging in.

### Steps

1. Log out or use incognito mode.
2. Navigate to order tracking page.
3. Enter:
   - Email used for order
   - Order number
4. Submit tracking request.
5. View order status and details.

### Expected

- tracking form is easily accessible
- form validates required fields
- correct order loads with email + order number
- order details are visible (status, items, tracking)
- error message is clear for invalid input
- tracking works same as authenticated view

### Watch For

- tracking form not working
- incorrect order loading
- missing order details
- unclear error messages
- exposing sensitive info without proper validation

---

## Scenario 17: Order Cancellation Flow

### Goal

Verify customers can cancel eligible orders.

### Steps

1. Navigate to an order detail page (order must be cancellable).
2. Click "Cancel Order" button.
3. Observe confirmation dialog.
4. Confirm cancellation.
5. Verify order status updates.

### Expected

- cancel button only appears for eligible orders
- confirmation dialog explains consequences
- cancellation processes successfully
- order status updates to "cancelled"
- user receives feedback confirmation
- cancelled order reflects in order list

### Watch For

- cancel button on non-cancellable orders
- missing confirmation dialog
- cancellation failing silently
- status not updating
- no user feedback

---

## Scenario 18: Reorder Functionality

### Goal

Verify customers can quickly reorder from past orders.

### Steps

1. Navigate to order detail page.
2. Click "Reorder" button.
3. Observe items being added to cart.
4. Navigate to cart to verify.

### Expected

- reorder button is visible
- all order items add to cart
- unavailable items are handled gracefully
- user receives feedback on action
- cart displays newly added items
- quantities match original order

### Watch For

- reorder button not working
- items not adding to cart
- out-of-stock items not handled
- no user feedback
- incorrect quantities

---

## Scenario 19: Customer Profile Management

### Goal

Verify customers can manage their profile information.

### Steps

1. Log in and navigate to Profile page.
2. Review profile sections:
   - Profile photo
   - Personal information (name, email, phone)
   - Password management
   - Account status
3. Update name and save.
4. Verify changes persist.

### Expected

- profile page is well-organized
- all sections are clearly labeled
- form fields are pre-filled with current data
- save button validates before enabling
- updates save successfully
- success feedback is clear
- changes reflect immediately
- data persists after page refresh

### Watch For

- missing profile data
- save button not validating
- updates failing silently
- no success feedback
- changes not persisting

---

## Scenario 20: Profile Avatar Upload

### Goal

Verify customers can upload and update profile pictures.

### Steps

1. Navigate to Profile page.
2. Click "Upload new picture" button.
3. Select a valid image (JPEG, PNG, WebP under 2MB).
4. Observe upload process.
5. Check avatar updates in:
   - Profile page
   - Header dropdown
   - Any other locations showing user avatar
6. Try uploading invalid file (too large or wrong format).

### Expected

- file picker opens on button click
- preview shows during/after upload
- upload progress is visible
- success feedback appears
- avatar updates globally across UI
- invalid files show clear error messages
- file size limit enforced (2MB)
- accepted formats validated

### Watch For

- upload not working
- avatar not updating globally
- missing error messages for invalid files
- no upload progress indicator
- broken image display

---

## Scenario 21: Password Management

### Goal

Verify customers can change their password securely.

### Steps

1. Navigate to Profile page.
2. Locate password section.
3. Fill in:
   - Current password
   - New password (at least 8 characters)
   - Confirm new password
4. Toggle password visibility icons.
5. Try mismatched passwords.
6. Try incorrect current password.
7. Successfully change password.
8. Log out and log back in with new password.

### Expected

- password fields have visibility toggles
- real-time validation shows requirements
- mismatched passwords show error
- incorrect current password shows clear error
- successful change shows confirmation
- form clears after success
- can log in immediately with new password

### Watch For

- visibility toggle not working
- weak password accepted
- unclear validation messages
- form not clearing after success
- incorrect current password not caught
- cannot log in with new password

---

## Scenario 22: Account Deletion Flow

### Goal

Verify account deletion is handled safely and clearly.

### Steps

1. Navigate to Profile page.
2. Locate "Danger Zone" or account deletion section.
3. Click "Delete Account" button.
4. Review deletion confirmation dialog.
5. Check what data will be deleted.
6. Cancel the deletion.
7. (Optional in test environment) Confirm deletion and verify account removal.

### Expected

- deletion section is visually distinct (red/danger styling)
- delete button has clear warning
- confirmation dialog has strong warning language
- dialog lists consequences (orders, data lost)
- warning emphasizes irreversibility
- cancel button is easily accessible
- (if confirmed) account deletes and logs out user

### Watch For

- deletion without confirmation
- weak warning language
- unclear consequences
- missing data list
- easy accidental deletion
- account not actually deleting

---

## Scenario 23: Google Account Linking Indicator

### Goal

Verify Google-linked accounts show appropriate indicators.

### Steps

1. Log in with Google OAuth account.
2. Navigate to Profile page.
3. Check for Google account indicator.
4. Verify password section behavior (set password option for Google users).

### Expected

- Google-linked badge/indicator is visible
- indicator shows "Linked" or similar status
- Google users can optionally set password for email login
- password section explains Google vs password auth
- UI clearly distinguishes auth method

### Watch For

- missing Google indicator
- incorrect authentication method shown
- confusing password options
- unable to set password as Google user

---

## Scenario 24: Multi-Language Support (if enabled)

### Goal

Verify language switching works correctly throughout the site.

### Steps

1. Locate language switcher in header/topbar.
2. Switch from English to Arabic (or vice versa).
3. Observe:
   - UI text translation
   - Layout direction (RTL for Arabic)
   - URL locale prefix change
   - Content translation
4. Navigate to different pages.
5. Verify translations persist.

### Expected

- language switcher is visible and accessible
- switching updates all UI text immediately
- RTL layout applies correctly for Arabic
- URL updates with correct locale prefix (`/en/` or `/ar/`)
- translations are consistent throughout
- user's language preference persists
- all pages respect selected language

### Watch For

- language not switching
- partial translations (mixed languages)
- RTL layout issues
- URL not updating
- language resetting unexpectedly
- broken layout after switch

---

## Scenario 25: Theme and Branding Consistency

### Goal

Verify merchant's custom theme applies correctly.

### Steps

1. Browse through different pages.
2. Observe:
   - Colors (primary, background, text)
   - Typography (fonts, sizes)
   - Border radius
   - Logo and favicon
3. Check DevTools for CSS custom properties.

### Expected

- consistent colors throughout site
- custom fonts load correctly
- branding (logo, favicon) displays properly
- theme direction (LTR/RTL) is correct
- CSS variables apply correctly
- no style conflicts or overrides
- responsive design works with theme

### Watch For

- inconsistent colors across pages
- fonts not loading
- missing or broken logo
- wrong favicon
- CSS variable failures
- broken responsive design

---

## Scenario 26: Mobile Responsiveness

### Goal

Verify the entire customer experience works on mobile viewports.

### Steps

1. Open DevTools and toggle device emulation (mobile viewport).
2. Test all scenarios on mobile:
   - Navigation (burger menu)
   - Product browsing
   - Product detail
   - Cart management
   - Checkout flow
   - Account pages
3. Test touch interactions.
4. Check layout at various breakpoints.

### Expected

- mobile menu (burger) works correctly
- all pages are mobile-optimized
- touch targets are adequately sized
- forms are usable on mobile
- images scale appropriately
- text is readable without zooming
- sticky elements work correctly
- checkout is mobile-friendly

### Watch For

- broken mobile layouts
- burger menu not opening
- text too small
- buttons too small to tap
- horizontal scrolling
- overlapping elements
- forms hard to fill on mobile

---

## Scenario 27: Performance and Loading States

### Goal

Verify pages load quickly with appropriate loading states.

### Steps

1. Browse through various pages.
2. Observe initial page loads.
3. Check for loading indicators during:
   - Navigation
   - Form submissions
   - Cart operations
   - Search queries
4. Monitor Network tab in DevTools.
5. Check for lazy loading of images.

### Expected

- pages load within acceptable time (~2-3 seconds)
- loading spinners appear during async operations
- skeleton screens or placeholders for content
- images lazy load as user scrolls
- no blocking operations
- smooth transitions between pages
- appropriate caching strategies

### Watch For

- pages taking too long to load
- missing loading indicators
- janky scrolling or animations
- images loading all at once
- excessive network requests
- console errors or warnings

---

## Scenario 28: Error Handling and Edge Cases

### Goal

Verify the app handles errors and edge cases gracefully.

### Steps

1. Test error scenarios:
   - Add out-of-stock product to cart
   - Enter invalid email format
   - Submit empty forms
   - Navigate to non-existent product
   - Trigger API failure (disconnect network briefly)
2. Observe error messages and recovery options.

### Expected

- clear, user-friendly error messages
- validation errors appear inline
- network errors have retry options
- 404 pages are helpful with navigation options
- form errors prevent submission
- users can recover from errors easily
- no cryptic technical error messages

### Watch For

- cryptic error messages
- blank error pages
- no recovery options
- forms submitting with invalid data
- app breaking on errors
- console flooding with errors

---

## Scenario 29: Checkout Success and Recovery

### Goal

Verify checkout completion and cancellation flows work correctly.

### Steps

1. Complete a successful checkout.
2. Observe checkout success page.
3. In a separate test, cancel checkout on Stripe page.
4. Observe checkout cancellation page.
5. Verify cart state in both scenarios.

### Expected

**Success Flow:**
- success page shows order confirmation
- order number is displayed
- order details are accurate
- cart clears after successful checkout
- user can view order in order history

**Cancellation Flow:**
- cancellation page explains what happened
- cart items are still available
- user can return to cart or retry checkout
- no payment was processed

### Watch For

- missing order confirmation
- cart not clearing after success
- cart clearing after cancellation
- missing order in history
- broken recovery from cancellation

---

## Scenario 30: SEO and Meta Tags

### Goal

Verify pages have appropriate SEO metadata.

### Steps

1. Visit various pages (home, product, category).
2. Check page source or DevTools for:
   - Title tags
   - Meta descriptions
   - Open Graph tags
   - Canonical URLs
   - Structured data (if implemented)

### Expected

- each page has unique, descriptive title
- meta descriptions are present and relevant
- Open Graph tags for social sharing
- canonical URLs are correct
- structured data for products (if implemented)
- images have alt attributes

### Watch For

- missing or duplicate titles
- missing meta descriptions
- incorrect Open Graph data
- missing canonical URLs
- images without alt text

---

## Scenario 31: Browser History and Back Button Behavior

### Goal

Verify browser navigation works naturally throughout the shopping journey.

### Steps

1. Navigate through a complete shopping flow:
   - Home → Shop → Product → Cart → Checkout
2. Use browser back button at each step.
3. Use forward button to return.
4. Refresh pages at various points.

### Expected

- back button works intuitively at each step
- no unexpected redirects or loops
- state is preserved appropriately
- cart persists through navigation
- no loss of user input or selections
- browser history reflects actual user journey

### Watch For

- back button not working
- redirect loops
- state loss on navigation
- cart clearing unexpectedly
- form data lost on back navigation

---

## Quick Runtime Checks

While testing in Chromium, also monitor:

- **Console** - No JavaScript errors or warnings
- **Network** - No failed API requests or 404s
- **Performance** - No significant blocking operations
- **Accessibility** - Keyboard navigation works, ARIA labels present
- **Local Storage** - Guest cart data properly namespaced
- **Session Storage** - Authentication tokens secure
- **Cookies** - Session cookies set correctly

---

## Known Verification Notes

- Guest cart uses localStorage with tenant isolation (key: `cart_{tenantId}`).
- On login, guest cart automatically merges with user's server-side cart.
- Stripe checkout uses hosted pages (customer redirects to Stripe and back).
- Email verification is required for new registrations.
- Google OAuth users can optionally set a password for email login.
- Order cancellation is only available for orders in "pending" or "processing" status.
- Multi-language support includes English (en) and Arabic (ar) with full RTL support.
- Theme customization (colors, fonts, radius) is merchant-controlled and loads dynamically.

---

## Test Account Recommendations

For comprehensive testing, prepare:

1. **Guest User** - No account, testing guest flows
2. **New Customer** - For registration and first-time experience
3. **Customer with Orders** - For testing order history and reorder
4. **Customer with Empty Cart** - For testing empty states
5. **Google OAuth User** - For testing social login
6. **Customer with Multiple Languages** - For i18n testing

---

## Critical User Journeys to Validate

### Journey 1: Guest Purchase
Guest → Browse → Add to Cart → Checkout → Order Confirmation

### Journey 2: Account Creation and Purchase
Guest → Register → Verify Email → Browse → Purchase → View Orders

### Journey 3: Returning Customer
Login → View Orders → Reorder → Checkout

### Journey 4: Profile Management
Login → Profile → Update Info → Upload Avatar → Change Password

### Journey 5: Order Management
Login → Orders → View Details → Track Order → Cancel or Reorder

---

## Final Validation Checklist

Before considering customer UX complete, verify:

- ✅ All pages load without errors
- ✅ Navigation is intuitive and consistent
- ✅ Shopping cart works for guests and users
- ✅ Checkout completes successfully
- ✅ Authentication (email + Google OAuth) works
- ✅ Profile management is fully functional
- ✅ Order history and tracking work correctly
- ✅ Mobile experience is optimized
- ✅ Multi-language support works (if enabled)
- ✅ Theme customization applies correctly
- ✅ Error states are user-friendly
- ✅ Performance is acceptable
- ✅ No console errors in production
- ✅ SEO metadata is present
- ✅ Accessibility basics are covered
