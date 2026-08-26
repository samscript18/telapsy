import os
import testmu
from testmu import expect, var, set_var
from playwright.async_api import Page

testmu.configure(
    build="ebcf86ca-d139-45eb-a9aa-a0ca38c916c1",
    name="Verify Redirects for Unauthenticated Visitors",
    tc_id="TC-13",
    network=os.getenv("NETWORK", "false").lower() == "true",
    variables={"telapsy_sign_in_redirect_initial": "/signin", "account_sign_in_redirect_check": "/signin"},
    auto_heal_version="AH2",
    default_action_timeout_ms=10000,
    default_navigation_timeout_ms=60000,
    kane_run_v4=True,
)

@testmu.test
async def test(page: Page):
    async with testmu.step('Navigate to http://localhost:3000/orders', instruction_id='b5f2a434-4c2a-44b6-aafa-ff28d5e5fca9'):
        await page.goto("http://localhost:3000/orders")
    
    async with testmu.step('Reading the current page pathname', instruction_id='5aacdfe2-71c7-4ba1-82b0-334b17e56e16'):
        set_var('telapsy_sign_in_redirect_initial', await testmu.derive(page, 'return new URL(value).pathname', page.url))
    
    async with testmu.step('Assertion check', instruction_id='6b4a753e-fc91-4225-af55-84eca97260f2'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'the unauthenticated visitor is redirected to the Telapsy sign-in page', 'passed': True, 'operator': 'equals', 'transforms': [], 'json_path': None, 'expected': '/signin', 'extracted_value': '{{telapsy_sign_in_redirect_initial}}', 'store_key': 'telapsy_sign_in_redirect_initial', 'variable_refs': {'{{telapsy_sign_in_redirect_initial}}': '/signin'}}], 'sub_checks': [{'description': 'the unauthenticated visitor is redirected to the Telapsy sign-in page', 'store_key': 'telapsy_sign_in_redirect_initial', 'expected_value': '/signin', 'extracted_value': '{{telapsy_sign_in_redirect_initial}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'the unauthenticated visitor is redirected to the Telapsy sign-in page'})
    
    async with testmu.step('Navigating to the account page on localhost:3000', instruction_id='4032343a-8fad-4cfa-b725-612db02d7c11'):
        await page.goto("http://localhost:3000/account")
    
    async with testmu.step('Reading the current URL pathname', instruction_id='a278793d-dbc1-4036-9fb1-e9cf4af18b2b'):
        set_var('account_sign_in_redirect_check', await testmu.derive(page, 'return new URL(value).pathname', page.url))
    
    async with testmu.step('Assertion check', instruction_id='94fb1718-9524-4932-9978-104d6afd8d82'):
        await testmu.verify_assertion(page, 'Assertion check', {'operator': ['equals'], 'assertion_operands': [], 'left_operand': None, 'right_operand': None, 'operands': [], 'sub_results': [{'description': 'the visitor is again redirected to sign in', 'passed': True, 'operator': 'equals', 'transforms': [], 'json_path': None, 'expected': '/signin', 'extracted_value': '{{account_sign_in_redirect_check}}', 'store_key': 'account_sign_in_redirect_check', 'variable_refs': {'{{account_sign_in_redirect_check}}': '/signin'}}], 'sub_checks': [{'description': 'the visitor is again redirected to sign in', 'store_key': 'account_sign_in_redirect_check', 'expected_value': '/signin', 'extracted_value': '{{account_sign_in_redirect_check}}', 'operator': 'equals', 'transforms': []}], 'composite_operator': 'and', 'claim': 'the visitor is again redirected to sign in'})


if __name__ == "__main__":
    testmu.run(test)