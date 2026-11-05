import json
import os
import sys

def main():
    test_data_dir = os.path.join(os.path.dirname(__file__), 'test_data')
    results_path = os.path.join(test_data_dir, 'qa_test_results.json')
    
    if not os.path.exists(results_path):
        print(f"Error: Could not locate test results at {results_path}")
        sys.exit(1)
        
    with open(results_path, 'r', encoding='utf-8') as f:
        cases = json.load(f)
        
    total = len(cases)
    passed = sum(1 for c in cases if c.get('status') == 'PASS')
    failed = sum(1 for c in cases if c.get('status') == 'FAIL')
    
    modules = {}
    for c in cases:
        mod = c.get('module', 'Other')
        modules.setdefault(mod, []).append(c)
        
    print("=" * 70)
    print(" TRUSTLENS AI — EMPIRICAL TEST SUITE EXECUTION SUMMARY")
    print("=" * 70)
    print(f"Total Test Cases: {total}")
    print(f"Passed:           {passed} ({passed/total*100:.1f}%)")
    print(f"Failed:           {failed}")
    print("-" * 70)
    print(f"{'Module Name':<30} | {'Cases':<6} | {'Passed':<6} | {'Pass Rate':<8}")
    print("-" * 70)
    for mod, mod_cases in modules.items():
        m_total = len(mod_cases)
        m_pass = sum(1 for c in mod_cases if c.get('status') == 'PASS')
        print(f"{mod:<30} | {m_total:<6} | {m_pass:<6} | {m_pass/m_total*100:.0f}%")
    print("=" * 70)

if __name__ == '__main__':
    main()

