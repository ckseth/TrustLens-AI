import ctypes
from ctypes import wintypes
import os

rstrtmgr = ctypes.WinDLL('rstrtmgr')

CCH_RM_SESSION_KEY = 32
CCH_RM_MAX_APP_NAME = 255
CCH_RM_MAX_SVC_NAME = 63

class RM_UNIQUE_PROCESS(ctypes.Structure):
    _fields_ = [
        ('dwProcessId', wintypes.DWORD),
        ('ProcessStartTime', wintypes.FILETIME)
    ]

class RM_PROCESS_INFO(ctypes.Structure):
    _fields_ = [
        ('Process', RM_UNIQUE_PROCESS),
        ('strAppName', wintypes.WCHAR * (CCH_RM_MAX_APP_NAME + 1)),
        ('strServiceShortName', wintypes.WCHAR * (CCH_RM_MAX_SVC_NAME + 1)),
        ('ApplicationType', wintypes.DWORD),
        ('AppStatus', wintypes.DWORD),
        ('TSSessionId', wintypes.DWORD),
        ('bRestartable', wintypes.BOOL)
    ]

session_handle = wintypes.DWORD()
session_key = (wintypes.WCHAR * (CCH_RM_SESSION_KEY + 1))()

res = rstrtmgr.RmStartSession(ctypes.byref(session_handle), 0, session_key)
if res == 0:
    try:
        path = os.path.abspath('TrustLens_AI_Project_Report.docx')
        files = (wintypes.LPCWSTR * 1)(path)
        rstrtmgr.RmRegisterResources(session_handle, 1, files, 0, None, 0, None)
        
        n_proc_info_needed = wintypes.UINT()
        n_proc_info = wintypes.UINT(10)
        proc_info = (RM_PROCESS_INFO * 10)()
        reboot_reasons = wintypes.DWORD()
        
        res = rstrtmgr.RmGetList(
            session_handle,
            ctypes.byref(n_proc_info_needed),
            ctypes.byref(n_proc_info),
            proc_info,
            ctypes.byref(reboot_reasons)
        )
        if res == 0:
            print(f"Found {n_proc_info.value} processes locking the file:")
            for i in range(n_proc_info.value):
                p = proc_info[i]
                print(f"  PID: {p.Process.dwProcessId}, Name: {p.strAppName}")
        else:
            print("RmGetList returned:", res)
    finally:
        rstrtmgr.RmEndSession(session_handle)
else:
    print("RmStartSession failed:", res)

